import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { GeyserConverter } from "../dist/convert/geyser/GeyserConverter.js";
import { EncoderGeyser } from "../dist/encoder/geyser/EncoderGeyser.js";
import { zipDirectory } from "../dist/utils/archive.js";

// 1x1 透明 PNG
const PNG = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC",
    "base64"
);

let root: string;
let contentsDir: string;
let generatedZip: string;
let outDir: string;

function w(file: string, content: string | Buffer) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
}

// 与 geyserConverter.test.ts 同款 stub：cube_all → 内置 full_block
const geometryConvert = (m: any, o: any) => {
    const parent = String(m?.parent || "").split(":").pop();
    if (parent === "item/generated") return { geometry: undefined, materials: {}, isItemSprite: true };
    return { geometry: undefined, materials: { "*": { texture: m.textures.all, render_method: "opaque" } } };
};

// 模拟 IA ia_auto：模型与 ia:<n> 序号引用只存在于 generated.zip，contents 里只有原始贴图
beforeAll(async () => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "ia-auto-test-"));
    contentsDir = path.join(root, "contents");
    outDir = path.join(root, "out");
    const ns = "iaauto";
    const asset = path.join(contentsDir, ns, "resourcepack", "assets", ns);

    w(path.join(contentsDir, ns, "configs", `${ns}.yml`), `
info:
  namespace: ${ns}
items:
  ore_block:
    display_name: "&f蓝矿石"
    resource:
      material: PAPER
      generate: true
      textures: [ore_block]
    behaviours:
      block:
        placed_model:
          type: REAL_NOTE
        hardness: 3
  ore_raw:
    display_name: "&f粗蓝矿"
    resource:
      material: PAPER
      generate: true
      textures: [ore_raw]
`);

    // contents 只有贴图（模型不在 contents）
    w(path.join(asset, "textures", "ore_block.png"), PNG);
    w(path.join(asset, "textures", "ore_raw.png"), PNG);

    // fixture generated.zip
    const zipSrc = path.join(root, "gensrc");
    w(path.join(zipSrc, "assets/minecraft/blockstates/note_block.json"), JSON.stringify({
        variants: { "instrument=basedrum,note=0,powered=false": { model: `${ns}:item/ia_auto/ore_block` } },
    }));
    w(path.join(zipSrc, "assets/minecraft/models/item/paper.json"), JSON.stringify({
        overrides: [
            { predicate: { custom_model_data: 10010 }, model: `${ns}:item/ia_auto/ore_block` },
            { predicate: { custom_model_data: 10011 }, model: `${ns}:item/ia_auto/ore_raw` },
        ],
    }));
    w(path.join(zipSrc, `assets/${ns}/models/item/ia_auto/ore_block.json`),
        JSON.stringify({ parent: "block/cube_all", textures: { all: "ia:464", particle: "ia:464" } }));
    w(path.join(zipSrc, `assets/${ns}/models/item/ia_auto/ore_raw.json`),
        JSON.stringify({ parent: "item/generated", textures: { layer0: "ia:449" } }));

    generatedZip = path.join(root, "generated.zip");
    await zipDirectory(zipSrc, generatedZip);
});

afterAll(() => {
    try { fs.rmSync(root, { recursive: true, force: true }); } catch { /* ignore */ }
});

const BLOCK = {
    hostBlock: "minecraft:note_block",
    rawVariant: "instrument=basedrum,note=0,powered=false",
    model: "iaauto:item/ia_auto/ore_block",
};
const ITEMS = [
    { baseMaterial: "minecraft:paper", customModelData: 10010, model: "iaauto:item/ia_auto/ore_block" },
    { baseMaterial: "minecraft:paper", customModelData: 10011, model: "iaauto:item/ia_auto/ore_raw" },
];

function convert(generated: any) {
    return GeyserConverter.convert(generated, {
        namespace: "iaauto", contentsDir, generatedZip, geometryConvert: geometryConvert as any,
    });
}

describe("ia_auto：模型只在 generated.zip + ia:<n> 序号引用", () => {
    it("方块回退到 zip 读模型，并把 ia: 解析成命名空间内同名贴图", () => {
        const pack = convert({ blockStates: [BLOCK], itemOverrides: [] });

        expect(pack.blocks).toHaveLength(1);
        const b = pack.blocks[0];
        expect(b.name).toBe("ore_block");
        expect(b.geometryId).toBe("minecraft:geometry.full_block");
        expect(b.materialInstances["*"].texture).toBe("iaauto_ore_block");
        expect(b.destructibleByMining).toBe(3);
        expect(b.displayName).toBe("蓝矿石");

        const tex = pack.textures.find((t) => t.key === "iaauto_ore_block");
        expect(tex?.kind).toBe("block");
        expect(tex?.bedrockPath).toBe("textures/blocks/ore_block");
    });

    it("方块物品（无 layer0）用方块纹理当图标，不再被跳过", () => {
        const pack = convert({ blockStates: [BLOCK], itemOverrides: ITEMS });

        const byName = Object.fromEntries(pack.items.map((i) => [i.name, i]));
        expect(Object.keys(byName).sort()).toEqual(["ore_block_item", "ore_raw"]);
        // 与方块同名 → 加 _item 后缀，避免基岩标识符冲突
        expect(byName.ore_block_item.icon).toBe("iaauto_ore_block");
        expect(byName.ore_block_item.customModelData).toBe(10010);
        expect(byName.ore_raw.icon).toBe("iaauto_ore_raw");
        expect(byName.ore_raw.customModelData).toBe(10011);
        expect(byName.ore_raw.displayName).toBe("粗蓝矿");

        expect(pack.textures.find((t) => t.key === "iaauto_ore_raw")?.kind).toBe("item");
    });

    it("manifest UUID 跨构建稳定（确定性）", async () => {
        const pack = convert({ blockStates: [BLOCK], itemOverrides: ITEMS });
        const a = path.join(outDir, "a");
        const b = path.join(outDir, "b");
        await EncoderGeyser.encode(pack, { outDir: a, packVersion: [1, 0, 52] });
        await EncoderGeyser.encode(pack, { outDir: b, packVersion: [1, 0, 52] });

        const ma = JSON.parse(fs.readFileSync(path.join(a, "iaauto_geyser_rp", "manifest.json"), "utf-8"));
        const mb = JSON.parse(fs.readFileSync(path.join(b, "iaauto_geyser_rp", "manifest.json"), "utf-8"));
        expect(ma.header.uuid).toBe(mb.header.uuid);
        expect(ma.modules[0].uuid).toBe(mb.modules[0].uuid);
        expect(ma.header.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
        expect(ma.header.uuid).not.toBe(ma.modules[0].uuid);

        // mapping 侧：1 宿主 + 1 状态覆盖 + 2 物品
        const mapping = JSON.parse(fs.readFileSync(path.join(a, "custom_mappings", "iaauto.json"), "utf-8"));
        expect(Object.keys(mapping.blocks)).toEqual(["minecraft:note_block"]);
        expect(Object.keys(mapping.blocks["minecraft:note_block"].state_overrides))
            .toEqual(["instrument=basedrum,note=0,powered=false"]);
        expect(mapping.items["minecraft:paper"]).toHaveLength(2);
    });
});
