import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { createHash } from "crypto";
import AdmZip from "adm-zip";
import sharp from "sharp";
import { buildTitleGlyphs } from "../dist/encoder/geyser/TitleGlyphBuilder.js";

async function fixture(run: (file: string, png: Buffer) => Promise<void>, mode = "normal") {
    const dir = mkdtempSync(path.join(tmpdir(), "title-font-check-"));
    try {
        const png = await sharp({ create: { width: 52, height: 9, channels: 4, background: "#93dafbff" } }).png().toBuffer();
        const glyph = { id: "island", codepoint: 0xE301, texture: "textures/ui/skyblock/titles/glyphs/island.png",
            pixelSha256: createHash("sha256").update(await sharp(png).ensureAlpha().raw().toBuffer()).digest("hex"), width: 52, height: 9, ascent: 8 };
        const provider = { type: "bitmap", file: "minecraft:ui/skyblock/titles/glyphs/island.png", height: 9, ascent: 8, chars: ["\uE301"] };
        const zip = new AdmZip();
        if (mode !== "missing") zip.addFile("assets/minecraft/textures/ui/skyblock/titles/glyphs/mapping.json",
            Buffer.from(JSON.stringify({ version: 1, cellSize: 64, glyphs: [glyph] })));
        zip.addFile("assets/minecraft/" + glyph.texture, mode === "hash" ? Buffer.from("changed") : png);
        zip.addFile("assets/minecraft/font/default.json", Buffer.from(JSON.stringify({ providers: mode === "mapping" ? [] : [provider] })));
        if (mode === "duplicate") zip.addFile("assets/other/font/default.json", Buffer.from(JSON.stringify({ providers: [provider] })));
        if (mode === "uniform") zip.addFile("assets/minecraft/font/uniform.json", Buffer.from(JSON.stringify({ providers: [provider] })));
        if (mode === "stale") zip.addFile("assets/minecraft/font/other.json", Buffer.from(JSON.stringify({ providers: [{ ...provider, chars: ["\uE304"] }] })));
        const file = path.join(dir, "generated.zip"); zip.writeZip(file);
        await run(file, png);
    } finally { rmSync(dir, { recursive: true, force: true }); }
}

describe("title font overlay", () => {
    it("places one intact glyph in its assigned cell, preserves alpha, and creates a matching receipt", async () => {
        await fixture(async (file, png) => {
            const base = new Map([["font/glyph_E0.png", Buffer.from("unchanged")]]);
            const a = await buildTitleGlyphs(file, base);
            const b = await buildTitleGlyphs(file, base);
            expect([...a.keys()]).toEqual(["font/glyph_E3.png", "skyblock/title-glyphs.json"]);
            expect(a.get("font/glyph_E3.png")).toEqual(b.get("font/glyph_E3.png"));
            expect(base.get("font/glyph_E0.png")!.toString()).toBe("unchanged");
            const page = a.get("font/glyph_E3.png")!;
            const area = await sharp(page).extract({ left: 64, top: 55, width: 52, height: 9 }).raw().toBuffer();
            expect(area).toEqual(await sharp(png).raw().toBuffer());
            const empty = await sharp(page).extract({ left: 0, top: 0, width: 64, height: 64 }).raw().toBuffer();
            expect([...empty].every(x => x === 0)).toBe(true);
            const receipt = JSON.parse(a.get("skyblock/title-glyphs.json")!.toString());
            expect(receipt.pageSha256).toBe(createHash("sha256").update(page).digest("hex"));
        });
    });
    it.each(["hash", "mapping", "duplicate", "stale"])("rejects %s input without changing base files", async mode => {
        await fixture(async file => { await expect(buildTitleGlyphs(file, new Map())).rejects.toThrow(); }, mode);
    });
    it("rejects a reserved page already owned by the shared base", async () => {
        await fixture(async file => { await expect(buildTitleGlyphs(file, new Map([["font/glyph_E3.png", Buffer.from("other")]]))).rejects.toThrow(/collides/); });
    });
    it("accepts ItemsAdder's identical uniform font mirror", async () => {
        await fixture(async file => { expect((await buildTitleGlyphs(file, new Map())).has("font/glyph_E3.png")).toBe(true); }, "uniform");
    });
    it("keeps existing ModUI builds compatible when the title manifest is absent", async () => {
        await fixture(async file => { expect((await buildTitleGlyphs(file, new Map())).size).toBe(0); }, "missing");
    });
});
