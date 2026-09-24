import fs from "fs";
import os from "os";
import path from "path";
import { execFileSync } from "child_process";
import { createHash } from "crypto";
import sharp from "sharp";

/** A deliberately narrow font overlay: only the title-owned E3 page can be generated. */
export const TITLE_MANIFEST = "textures/ui/skyblock/titles/glyphs/mapping.json";
export const TITLE_PAGE = "font/glyph_E3.png";
const JAVA_ROOT = "assets/minecraft/";
const RESERVATIONS: Record<string, number> = { sprout: 0xE300, island: 0xE301, harvest: 0xE302, night: 0xE303 };

export interface TitleGlyph {
    id: string;
    codepoint: number;
    texture: string;
    pixelSha256: string;
    width: number;
    height: number;
    ascent: number;
}

export interface TitleGlyphManifest { version: 1; cellSize: 64; glyphs: TitleGlyph[] }

/**
 * Reads only generated.zip, validates the default Java font registration and reserved codes,
 * then creates a single Bedrock glyph page. Existing base fonts must never be overwritten.
 * A missing manifest means this feature has not been onboarded; malformed inputs fail the build.
 */
export async function buildTitleGlyphs(generatedZip: string, baseFiles: Map<string, Buffer>): Promise<Map<string, Buffer>> {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "title-glyphs-"));
    try {
        // Inspect names before extracting, including archives with IA's unusual ZIP headers.
        const listing = execFileSync("unzip", ["-Z1", generatedZip], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 }).split(/\r?\n/);
        const manifestPath = JAVA_ROOT + TITLE_MANIFEST;
        if (!listing.includes(manifestPath)) return new Map();
        const selected = listing.filter(name => /^assets\/[^/]+\/font\/.+\.json$/.test(name) ||
            name.startsWith(JAVA_ROOT + "textures/ui/skyblock/titles/glyphs/"));
        if (new Set(selected).size !== selected.length) throw new Error("Duplicate title/font ZIP entries");
        for (const name of selected) {
            if (name.includes("\\") || name.split("/").some(part => part === ".." || part === "." || part === "")) {
                throw new Error(`Unsafe title/font path: ${name}`);
            }
        }
        try { execFileSync("unzip", ["-o", "-q", generatedZip, ...selected, "-d", tmp], { stdio: "ignore" }); }
        catch { /* IA protection may report an extraction warning; all required files are read below. */ }
        const read = (name: string) => fs.readFileSync(path.join(tmp, name));
        const bytes = read(manifestPath);
        const manifest = JSON.parse(bytes.toString("utf8")) as TitleGlyphManifest;
        if (manifest.version !== 1 || manifest.cellSize !== 64 || !Array.isArray(manifest.glyphs) || !manifest.glyphs.length) {
            throw new Error("Invalid title glyph manifest");
        }
        if (baseFiles.has(TITLE_PAGE)) throw new Error("Title glyph E3 page collides with the base resource pack");
        const ids = new Set<string>();
        const codes = new Set<number>();
        const overlays: sharp.OverlayOptions[] = [];
        const fontFiles = selected.filter(name => /^assets\/[^/]+\/font\/.+\.json$/.test(name));
        const fonts = new Map(fontFiles.map(name => [name, JSON.parse(read(name).toString("utf8"))]));
        for (const glyph of manifest.glyphs) {
            if (RESERVATIONS[glyph.id] !== glyph.codepoint || ids.has(glyph.id) || codes.has(glyph.codepoint)) {
                throw new Error(`Title codepoint collision or unstable mapping: ${glyph.id}`);
            }
            ids.add(glyph.id); codes.add(glyph.codepoint);
            if (!/^textures\/ui\/skyblock\/titles\/glyphs\/[a-z_]+\.png$/.test(glyph.texture) ||
                !/^[a-f0-9]{64}$/.test(glyph.pixelSha256) || !Number.isInteger(glyph.width) || glyph.width < 1 || glyph.width > 64 ||
                glyph.height !== 9 || glyph.ascent !== 8) throw new Error(`Invalid title metrics: ${glyph.id}`);
            const png = read(JAVA_ROOT + glyph.texture);
            const decoded = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
            if (createHash("sha256").update(new Uint8Array(decoded.data)).digest("hex") !== glyph.pixelSha256) throw new Error(`Title pixel hash mismatch: ${glyph.id}`);
            if (decoded.info.width !== glyph.width || decoded.info.height !== 9 || decoded.info.channels !== 4) {
                throw new Error(`Title PNG dimensions mismatch: ${glyph.id}`);
            }
            let ink = false;
            for (let i = 3; i < decoded.data.length; i += 4) {
                if (decoded.data[i] !== 0 && decoded.data[i] !== 255) throw new Error(`Title has smoothed alpha: ${glyph.id}`);
                ink ||= decoded.data[i] === 255;
            }
            if (!ink) throw new Error(`Empty title: ${glyph.id}`);
            const matches: Array<{ file: string; provider: any }> = [];
            for (const [file, font] of fonts) for (const provider of font.providers ?? []) {
                let occurrences = 0;
                for (const row of provider.chars ?? []) for (const character of row) if (character.codePointAt(0) === glyph.codepoint) occurrences++;
                if (provider.advances && Object.keys(provider.advances).some(c => c.codePointAt(0) === glyph.codepoint)) occurrences++;
                for (let i = 0; i < occurrences; i++) matches.push({ file, provider });
            }
            const expectedFile = `minecraft:${glyph.texture.slice("textures/".length)}`;
            // IA intentionally mirrors bitmap providers into uniform.json for Force Unicode.
            // Accept that identical mirror once, but never a conflicting or duplicate provider.
            const defaults = matches.filter(match => match.file === JAVA_ROOT + "font/default.json");
            const uniforms = matches.filter(match => match.file === JAVA_ROOT + "font/uniform.json");
            if (defaults.length !== 1 || uniforms.length > 1 || matches.length !== defaults.length + uniforms.length ||
                matches.some(({ provider }) => provider.type !== "bitmap" || provider.file !== expectedFile ||
                    provider.height !== 9 || provider.ascent !== 8 ||
                    JSON.stringify(provider.chars) !== JSON.stringify([String.fromCodePoint(glyph.codepoint)]))) {
                throw new Error(`Java font mapping missing, duplicated or inconsistent: ${glyph.id}`);
            }
            const slot = glyph.codepoint & 255;
            // Single full-width glyph per cell; bottom aligns to the baseline. Client acceptance
            // determines whether this Bedrock path renders the intended compact metrics.
            overlays.push({ input: png, left: (slot % 16) * 64, top: Math.floor(slot / 16) * 64 + 64 - 9 });
        }
        // Every title-owned code in the generated fonts must be declared, including stale glyphs.
        for (const font of fonts.values()) for (const provider of font.providers ?? []) {
            for (const row of provider.chars ?? []) for (const character of row) {
                const code = character.codePointAt(0)!;
                if (code >= 0xE300 && code <= 0xE3FF && !codes.has(code)) throw new Error("Unmanaged E3 glyph collision");
            }
        }
        const page = await sharp({ create: { width: 1024, height: 1024, channels: 4, background: "#00000000" } })
            .composite(overlays).png().toBuffer();
        const receipt = { version: 1, manifestSha256: createHash("sha256").update(new Uint8Array(bytes)).digest("hex"),
            pageSha256: createHash("sha256").update(new Uint8Array(page)).digest("hex"), glyphs: manifest.glyphs };
        return new Map([[TITLE_PAGE, page], ["skyblock/title-glyphs.json", Buffer.from(JSON.stringify(receipt) + "\n")]]);
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
}
