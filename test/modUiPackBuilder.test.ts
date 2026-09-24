import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createHash } from "crypto";
import fs from "fs";
import os from "os";
import path from "path";
import AdmZip from "adm-zip";
import {
    buildModUiPack,
    deployModUiPack,
    validateModUiEntryPath,
} from "../dist/encoder/geyser/ModUiPackBuilder.js";
import { extractModUiAssets } from "../dist/parser/itemsadder/ParserItemsAdderGenerated.js";
import { zipDirectory } from "../dist/utils/archive.js";

const HEADER_UUID = "02606e92-08d8-4bd9-827e-a37b66e77b8d";
const MODULE_UUID = "3995c4ca-c5f0-4d7e-8641-d40ed4f25b89";
const PNG = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC",
    "base64"
);

let root: string;

function manifest(headerVersion: number[], moduleVersion = headerVersion, headerUuid = HEADER_UUID) {
    return {
        format_version: 2,
        header: {
            name: "EaseCation UI",
            description: "EaseCation UI",
            uuid: headerUuid,
            version: headerVersion,
            min_engine_version: [1, 18, 0],
        },
        modules: [{
            type: "resources",
            description: "EaseCation UI Resource",
            uuid: MODULE_UUID,
            version: moduleVersion,
        }],
    };
}

function write(file: string, content: string | Buffer): void {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
}

async function makeZip(name: string, files: Record<string, string | Buffer>): Promise<string> {
    const source = path.join(root, `${name}-source`);
    for (const [entry, content] of Object.entries(files)) write(path.join(source, entry), content);
    const target = path.join(root, `${name}.zip`);
    await zipDirectory(source, target);
    return target;
}

function zipEntries(file: string): Map<string, Buffer> {
    return new Map(new AdmZip(file).getEntries()
        .filter(entry => !entry.isDirectory)
        .map(entry => [entry.entryName, entry.getData()]));
}

function sha256(file: string): string {
    return createHash("sha256").update(new Uint8Array(fs.readFileSync(file))).digest("hex");
}

beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "modui-pack-test-"));
});

afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
});

describe("ModUI generated.zip extraction", () => {
    it("recursively extracts only assets/minecraft/textures/ui", async () => {
        const generated = await makeZip("generated", {
            "assets/minecraft/textures/ui/root.png": PNG,
            "assets/minecraft/textures/ui/nested/panel.json": "{\"nineslice_size\":2}",
            "assets/minecraft/font/ignored.png": PNG,
            "pack.mcmeta": "{}",
        });

        const files = extractModUiAssets(generated);
        expect(files.map(file => file.relPath).sort()).toEqual([
            "textures/ui/nested/panel.json",
            "textures/ui/root.png",
        ]);
    });
});

describe("ModUI base merge and versioning", () => {
    it("rebuilds from the base, overlays current IA files, removes stale files, and bumps to 0.17.30", async () => {
        const base = await makeZip("base", {
            "manifest.json": JSON.stringify(manifest([0, 17, 28], [0, 17, 27])),
            "textures/ui/base.png": Buffer.from("base"),
            "textures/ui/common.png": Buffer.from("base-common"),
            "ui/hud_screen.json": "{}",
        });
        const current = await makeZip("current", {
            "manifest.json": JSON.stringify(manifest([0, 17, 29])),
            "textures/ui/base.png": Buffer.from("base"),
            "textures/ui/common.png": Buffer.from("old-common"),
            "textures/ui/stale-skyblock.png": Buffer.from("stale"),
            "ui/hud_screen.json": "{}",
        });
        const generated = await makeZip("generated", {
            "assets/minecraft/textures/ui/common.png": Buffer.from("new-common"),
            "assets/minecraft/textures/ui/enchantment/button.png": PNG,
            "assets/minecraft/textures/ui/skyblock/devour_monster/page.png": PNG,
        });

        const result = await buildModUiPack({
            basePack: base,
            currentPack: current,
            generatedZip: generated,
            outDir: path.join(root, "out"),
        });

        expect(result.changed).toBe(true);
        expect(result.version).toEqual([0, 17, 30]);
        expect(result.overlayFileCount).toBe(3);
        const entries = zipEntries(result.outputPack!);
        expect(entries.get("textures/ui/common.png")?.toString()).toBe("new-common");
        expect(entries.has("textures/ui/base.png")).toBe(true);
        expect(entries.has("textures/ui/enchantment/button.png")).toBe(true);
        expect(entries.has("textures/ui/skyblock/devour_monster/page.png")).toBe(true);
        expect(entries.has("textures/ui/stale-skyblock.png")).toBe(false);
        expect(entries.has("ui/hud_screen.json")).toBe(true);
        const builtManifest = JSON.parse(entries.get("manifest.json")!.toString("utf-8"));
        expect(builtManifest.header.version).toEqual([0, 17, 30]);
        expect(builtManifest.modules[0].version).toEqual([0, 17, 30]);
    });

    it("does not rewrite or bump an already identical deployed pack", async () => {
        const base = await makeZip("base", {
            "manifest.json": JSON.stringify(manifest([0, 17, 28])),
            "textures/ui/base.png": PNG,
        });
        const generated = await makeZip("generated", {
            "assets/minecraft/textures/ui/new.png": PNG,
        });
        const first = await buildModUiPack({
            basePack: base,
            generatedZip: generated,
            outDir: path.join(root, "first-out"),
        });
        const deployed = path.join(root, "deployed.zip");
        fs.copyFileSync(first.outputPack!, deployed);

        const second = await buildModUiPack({
            basePack: base,
            currentPack: deployed,
            generatedZip: generated,
            outDir: path.join(root, "second-out"),
        });
        expect(second.changed).toBe(false);
        expect(second.version).toEqual([0, 17, 29]);
        expect(second.outputPack).toBeUndefined();
    });

    it("emits byte-identical ZIPs for identical inputs", async () => {
        const base = await makeZip("base", {
            "manifest.json": JSON.stringify(manifest([0, 17, 28])),
            "textures/ui/base.png": PNG,
        });
        const generated = await makeZip("generated", {
            "assets/minecraft/textures/ui/new.png": PNG,
        });
        const first = await buildModUiPack({
            basePack: base,
            generatedZip: generated,
            outDir: path.join(root, "deterministic-a"),
        });
        const second = await buildModUiPack({
            basePack: base,
            generatedZip: generated,
            outDir: path.join(root, "deterministic-b"),
        });
        expect(sha256(first.outputPack!)).toBe(sha256(second.outputPack!));
    });

    it("rebuilds identical content when deployed header and module versions disagree", async () => {
        const base = await makeZip("base", {
            "manifest.json": JSON.stringify(manifest([0, 17, 28])),
            "textures/ui/base.png": PNG,
        });
        const generated = await makeZip("generated", {
            "assets/minecraft/textures/ui/new.png": PNG,
        });
        const first = await buildModUiPack({
            basePack: base,
            generatedZip: generated,
            outDir: path.join(root, "first-out"),
        });
        const entries = zipEntries(first.outputPack!);
        const deployedManifest = JSON.parse(entries.get("manifest.json")!.toString("utf-8"));
        deployedManifest.modules[0].version = [0, 17, 28];
        const deployed = await makeZip("deployed-misaligned", Object.fromEntries([
            ...entries,
            ["manifest.json", JSON.stringify(deployedManifest)],
        ]));

        const rebuilt = await buildModUiPack({
            basePack: base,
            currentPack: deployed,
            generatedZip: generated,
            outDir: path.join(root, "rebuilt-out"),
        });
        expect(rebuilt.changed).toBe(true);
        expect(rebuilt.version).toEqual([0, 17, 30]);
        const rebuiltManifest = JSON.parse(zipEntries(rebuilt.outputPack!).get("manifest.json")!.toString("utf-8"));
        expect(rebuiltManifest.header.version).toEqual(rebuiltManifest.modules[0].version);
    });

    it("rejects an empty ModUI tree and an unexpected base UUID", async () => {
        const validBase = await makeZip("valid-base", {
            "manifest.json": JSON.stringify(manifest([0, 17, 28])),
            "textures/ui/base.png": PNG,
        });
        const emptyGenerated = await makeZip("empty-generated", { "pack.mcmeta": "{}" });
        await expect(buildModUiPack({
            basePack: validBase,
            generatedZip: emptyGenerated,
            outDir: path.join(root, "empty-out"),
        })).rejects.toThrow("contains no assets/minecraft/textures/ui files");

        const wrongBase = await makeZip("wrong-base", {
            "manifest.json": JSON.stringify(manifest([0, 17, 28], [0, 17, 28], "00000000-0000-0000-0000-000000000000")),
            "textures/ui/base.png": PNG,
        });
        const generated = await makeZip("generated-valid", {
            "assets/minecraft/textures/ui/new.png": PNG,
        });
        await expect(buildModUiPack({
            basePack: wrongBase,
            generatedZip: generated,
            outDir: path.join(root, "wrong-out"),
        })).rejects.toThrow("header UUID");
    });

    it("rejects unsafe ZIP paths before writing them", () => {
        for (const entry of ["../escape.png", "/absolute.png", "textures\\ui\\escape.png", "textures/ui/../escape.png"]) {
            expect(() => validateModUiEntryPath(entry, "test pack")).toThrow("unsafe ZIP path");
        }
        expect(validateModUiEntryPath("textures/ui/nested/panel.png", "test pack"))
            .toBe("textures/ui/nested/panel.png");
    });
});

describe("ModUI atomic deployment", () => {
    it("backs up the old pack and atomically installs the validated replacement", async () => {
        const target = await makeZip("target", {
            "manifest.json": JSON.stringify(manifest([0, 17, 29])),
            "textures/ui/current.png": Buffer.from("current"),
        });
        const replacement = await makeZip("replacement", {
            "manifest.json": JSON.stringify(manifest([0, 17, 30])),
            "textures/ui/current.png": Buffer.from("replacement"),
        });
        const oldHash = sha256(target);
        const replacementHash = sha256(replacement);

        const result = deployModUiPack(replacement, target, path.join(root, "backups"));
        expect(result.sha256).toBe(replacementHash);
        expect(sha256(target)).toBe(replacementHash);
        expect(result.backupPack).toBeTruthy();
        expect(sha256(result.backupPack!)).toBe(oldHash);
    });

    it("does not alter the deployed pack when the replacement is invalid", async () => {
        const target = await makeZip("target", {
            "manifest.json": JSON.stringify(manifest([0, 17, 29])),
            "textures/ui/current.png": PNG,
        });
        const before = sha256(target);
        const invalid = path.join(root, "invalid.zip");
        fs.writeFileSync(invalid, "not a zip");

        expect(() => deployModUiPack(invalid, target, path.join(root, "backups"))).toThrow("not a readable ZIP");
        expect(sha256(target)).toBe(before);
        expect(fs.existsSync(path.join(root, "backups"))).toBe(false);
    });
});
