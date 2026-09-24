import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { GeyserConverter } from "../dist/convert/geyser/GeyserConverter.js";
import { EncoderGeyser } from "../dist/encoder/geyser/EncoderGeyser.js";
import { extractBedrockPack } from "../dist/parser/itemsadder/ParserItemsAdderGenerated.js";
import { zipDirectory } from "../dist/utils/archive.js";

// 1x1 透明 PNG
const PNG = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC",
    "base64"
);

let contentsDir: string;
let outDir: string;

function w(file: string, content: string | Buffer) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
}

beforeAll(() => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "ia-conv-test-"));
    contentsDir = path.join(root, "contents");
    outDir = path.join(root, "out");
    const ns = "test";
    const asset = path.join(contentsDir, ns, "resourcepack", "assets", ns);

    // configs
    w(path.join(contentsDir, ns, "configs", "test.yml"), `
info:
  namespace: test
items:
  cube_block:
    display_name: "&aCube"
    resource: { material: STONE, model_path: block/cube_block }
    behaviours:
      block:
        placed_model: { type: REAL }
        hardness: 1.5
        light_level: 7
  glass_block:
    display_name: "Glass"
    resource: { material: GLASS, model_path: block/glass_block }
    behaviours:
      block:
        placed_model: { type: REAL_TRANSPARENT }
        hardness: 0.3
  plant:
    display_name: "Plant"
    resource: { material: STRING, model_path: block/plant }
    behaviours:
      block:
        placed_model: { type: REAL_WIRE }
        hardness: 0
  mmo_skin:
    display_name: "MMO Skin"
    mmoitem: { type: BLOCK, id: '4' }
    resource: { material: STONE, model_path: block/mmo_skin }
  widget:
    display_name: "&bWidget"
    resource: { material: PAPER, model_path: item/widget_flat }
  test_blade:
    display_name: "&cTest Blade"
    resource: { material: IRON_SWORD, model_path: item/test_blade }
`);

    // models
    w(path.join(asset, "models", "block", "cube_block.json"), JSON.stringify({ parent: "minecraft:block/cube_all", textures: { all: "test:block/cube_block" } }));
    w(path.join(asset, "models", "block", "glass_block.json"), JSON.stringify({ parent: "minecraft:block/cube_all", textures: { all: "test:block/glass_block" } }));
    w(path.join(asset, "models", "block", "plant.json"), JSON.stringify({ parent: "minecraft:block/cross", textures: { cross: "test:block/plant" } }));
    w(path.join(asset, "models", "block", "mmo_skin.json"), JSON.stringify({ parent: "minecraft:block/cube_all", textures: { all: "test:block/mmo_skin" } }));
    w(path.join(asset, "models", "item", "widget_flat.json"), JSON.stringify({ parent: "minecraft:item/generated", textures: { layer0: "test:item/widget" } }));
    w(path.join(asset, "models", "item", "test_blade.json"), JSON.stringify({
        textures: { blade: "test:item/test_blade" },
        elements: [{ from: [0, 0, 0], to: [1, 16, 1] }],
    }));

    // textures
    for (const t of ["cube_block", "glass_block", "plant", "mmo_skin"]) w(path.join(asset, "textures", "block", `${t}.png`), PNG);
    w(path.join(asset, "textures", "item", "widget.png"), PNG);
    w(path.join(asset, "textures", "item", "test_blade.png"), PNG);
    w(path.join(contentsDir, ns, "geyser_icons", "test_blade.png"), PNG);
});

afterAll(() => {
    try { fs.rmSync(path.dirname(contentsDir), { recursive: true, force: true }); } catch { /* ignore */ }
});

// 注入的 stub 几何（mc-model-geo 单独测；这里只测转换器映射逻辑）
const geometryConvert = (m: any, o: any) => {
    const parent = String(m?.parent || "").split(":").pop();
    if (parent === "item/generated") return { geometry: undefined, materials: {}, isItemSprite: true };
    if (Array.isArray(m?.elements) && m.elements.length > 0) {
        return {
            geometry: {
                format_version: "1.16.0",
                "minecraft:geometry": [{
                    description: { identifier: o.identifier },
                    bones: [{ name: "root", cubes: [] }],
                }],
            },
            materials: { "*": { texture: m.textures.blade, render_method: "alpha_test" } },
        };
    }
    if (parent === "block/cross") {
        return {
            geometry: { format_version: "1.16.0", "minecraft:geometry": [{ description: { identifier: o.identifier } }] },
            materials: { "*": { texture: m.textures.cross, render_method: "alpha_test" } },
        };
    }
    // cube_all → 用内置 full_block
    return { geometry: undefined, materials: { "*": { texture: m.textures.all, render_method: "opaque" } } };
};

const GENERATED = {
    blockStates: [
        { hostBlock: "minecraft:note_block", rawVariant: "instrument=harp,note=0,powered=false", model: "test:block/cube_block" },
        { hostBlock: "minecraft:note_block", rawVariant: "instrument=harp,note=1,powered=false", model: "test:block/glass_block" },
        { hostBlock: "minecraft:tripwire", rawVariant: "attached=false,east=false,north=false,south=false,disarmed=false,west=false,powered=true", model: "test:block/plant" },
        { hostBlock: "minecraft:brown_mushroom_block", rawVariant: "down=false,east=false,north=true,south=false,up=false,west=false", model: "test:block/mmo_skin" },
    ],
    itemOverrides: [
        { baseMaterial: "minecraft:paper", customModelData: 5001, model: "test:item/widget_flat" },
        { baseMaterial: "minecraft:iron_sword", customModelData: 6001, model: "test:item/test_blade" },
    ],
};

describe("GeyserConverter M2 覆盖", () => {
    it("方块富化：硬度/发光/透明/植物", () => {
        const pack = GeyserConverter.convert(GENERATED as any, { namespace: "test", contentsDir, geometryConvert: geometryConvert as any });
        const byName = Object.fromEntries(pack.blocks.map(b => [b.name, b]));

        // cube_block: 不透明、full_block、硬度→destructible、发光→emission
        expect(byName.cube_block.geometryId).toBe("minecraft:geometry.full_block");
        expect(byName.cube_block.materialInstances["*"].render_method).toBe("opaque");
        expect(byName.cube_block.destructibleByMining).toBe(1.5);
        expect(byName.cube_block.lightEmission).toBe(7);
        expect(byName.cube_block.displayName).toBe("Cube"); // 颜色码已去除

        // glass_block: 透明 → blend + 不遮光
        expect(byName.glass_block.materialInstances["*"].render_method).toBe("blend");
        expect(byName.glass_block.lightDampening).toBe(0);
        expect(byName.glass_block.destructibleByMining).toBeCloseTo(0.3);

        // plant: alpha_test + 细选择框 + 瞬破
        expect(byName.plant.materialInstances["*"].render_method).toBe("alpha_test");
        expect(byName.plant.selectionBox).toBeTruthy();
        expect(byName.plant.destructibleByMining).toBe(0);
    });

    it("MMOItems skin-only 方块不需要 IA hardness 也会禁用基岩原版完成", () => {
        const pack = GeyserConverter.convert(GENERATED as any, { namespace: "test", contentsDir, geometryConvert: geometryConvert as any });
        const skin = pack.blocks.find(block => block.name === "mmo_skin");

        expect(skin?.displayName).toBe("MMO Skin");
        expect(skin?.destructibleByMining).toBe(-1);
    });

    it("物品映射：sprite 与 3D 武器默认禁用副手并保留关键字段", () => {
        const pack = GeyserConverter.convert(GENERATED as any, { namespace: "test", contentsDir, geometryConvert: geometryConvert as any });
        expect(pack.items.length).toBe(2);

        const widget = pack.items.find(item => item.name === "widget");
        expect(widget).toMatchObject({
            baseMaterial: "minecraft:paper",
            customModelData: 5001,
            displayName: "Widget",
            icon: "test_widget",
            allowOffhand: false,
        });

        const blade = pack.items.find(item => item.name === "test_blade");
        expect(blade).toMatchObject({
            baseMaterial: "minecraft:iron_sword",
            customModelData: 6001,
            displayName: "Test Blade",
            icon: "test_test_blade",
            allowOffhand: false,
            displayHandheld: true,
        });
    });

    it("EncoderGeyser 多块同 host 分组到 state_overrides", async () => {
        const pack = GeyserConverter.convert(GENERATED as any, { namespace: "test", contentsDir, geometryConvert: geometryConvert as any });
        const res = await EncoderGeyser.encode(pack, { outDir });
        const mapping = JSON.parse(fs.readFileSync(res.mappingFile, "utf-8"));

        // note_block 上两个自定义块 → 同一 host 条目下 2 个 state_overrides（字母序键）
        const noteBlock = mapping.blocks["minecraft:note_block"];
        expect(noteBlock.only_override_states).toBe(true);
        expect(Object.keys(noteBlock.state_overrides).sort()).toEqual([
            "instrument=harp,note=0,powered=false",
            "instrument=harp,note=1,powered=false",
        ]);
        // tripwire 上 1 个
        expect(Object.keys(mapping.blocks["minecraft:tripwire"].state_overrides).length).toBe(1);
        expect(
            mapping.blocks["minecraft:brown_mushroom_block"].state_overrides[
                "down=false,east=false,north=true,south=false,up=false,west=false"
            ].destructible_by_mining
        ).toBe(-1);
        // 物品分组
        expect(mapping.items["minecraft:paper"].length).toBe(1);
        expect(mapping.items["minecraft:paper"][0]).toMatchObject({
            name: "widget",
            icon: "test_widget",
            custom_model_data: 5001,
            allow_offhand: false,
        });
        expect(mapping.items["minecraft:iron_sword"][0]).toMatchObject({
            name: "test_blade",
            icon: "test_test_blade",
            custom_model_data: 6001,
            allow_offhand: false,
            display_handheld: true,
        });
    });
});

// bedrock_pack 原样搬运（粒子等基岩原生文件）：纯 passthrough 命名空间无方块/物品也产包
describe("bedrock_pack passthrough（从 generated.zip 合并提取）", () => {
    let pRoot: string, pOut: string, genZip: string;

    beforeAll(async () => {
        pRoot = fs.mkdtempSync(path.join(os.tmpdir(), "ia-conv-pt-"));
        pOut = path.join(pRoot, "out");
        // 造一个模拟 generated.zip：IA 把各命名空间 bedrock_pack 合并到 assets/minecraft/bedrock_pack/
        const src = path.join(pRoot, "gensrc");
        const bp = path.join(src, "assets", "minecraft", "bedrock_pack");
        for (const n of ["alpha", "beta"]) {
            w(path.join(bp, "particles", `${n}.particle.json`),
                JSON.stringify({ format_version: "1.10.0", particle_effect: { description: { identifier: `ecsb:${n}` } } }));
        }
        w(path.join(bp, "particles", "sub", "deep.particle.json"), JSON.stringify({ format_version: "1.10.0" })); // 子目录递归
        w(path.join(bp, "textures", "particle", "alpha.png"), PNG);
        w(path.join(bp, "animation_controllers", "swing.json"), JSON.stringify({ format_version: "1.10.0" }));
        w(path.join(bp, "manifest.json"), JSON.stringify({ bogus: true }));     // 根 manifest 必须被排除
        // 非 bedrock_pack 内容（方块状态等）不应被收
        w(path.join(src, "assets", "minecraft", "blockstates", "note_block.json"), "{}");
        w(path.join(src, "pack.mcmeta"), "{}");
        genZip = path.join(pRoot, "generated.zip");
        await zipDirectory(src, genZip);
    });

    afterAll(() => {
        try { fs.rmSync(pRoot, { recursive: true, force: true }); } catch { /* ignore */ }
    });

    it("extractBedrockPack：整树递归提取，排除根 manifest 与非 bedrock_pack", () => {
        const files = extractBedrockPack(genZip);
        const rels = files.map((f: any) => f.relPath).sort();
        expect(rels).toEqual([
            "animation_controllers/swing.json",
            "particles/alpha.particle.json",
            "particles/beta.particle.json",
            "particles/sub/deep.particle.json",
            "textures/particle/alpha.png",
        ]);
        expect(rels).not.toContain("manifest.json");
        expect(rels.some((r: string) => r.includes("blockstates"))).toBe(false);
    });

    it("encode 纯 passthrough 包：文件落 RP，manifest 自产，无 mapping", async () => {
        const files = extractBedrockPack(genZip);
        const pack: any = {
            namespace: "ecsb_bedrock",
            blocks: [], items: [], geometries: [], textures: [], attachables: [], animations: [],
            passthrough: files,
        };
        const res = await EncoderGeyser.encode(pack, { outDir: pOut, packVersion: [1, 2, 3] });
        const rpDir = path.join(pOut, "ecsb_bedrock_geyser_rp");
        expect(fs.existsSync(path.join(rpDir, "particles", "alpha.particle.json"))).toBe(true);
        expect(fs.existsSync(path.join(rpDir, "particles", "sub", "deep.particle.json"))).toBe(true);
        expect(fs.existsSync(path.join(rpDir, "textures", "particle", "alpha.png"))).toBe(true);
        expect(fs.existsSync(path.join(rpDir, "animation_controllers", "swing.json"))).toBe(true);
        // 根 manifest 是 convertor 自产（format_version 2），非 passthrough 的 bogus
        const manifest = JSON.parse(fs.readFileSync(path.join(rpDir, "manifest.json"), "utf-8"));
        expect(manifest.format_version).toBe(2);
        expect(manifest.bogus).toBeUndefined();
        // 纯 passthrough：mapping 无 items/blocks
        const mapping = JSON.parse(fs.readFileSync(res.mappingFile, "utf-8"));
        expect(mapping.items).toBeUndefined();
        expect(mapping.blocks).toBeUndefined();
        expect(fs.existsSync(res.rpZip)).toBe(true);
    });
});
