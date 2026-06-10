import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";
import { GeyserConverter } from "../dist/convert/geyser/GeyserConverter.js";
import { EncoderGeyser } from "../dist/encoder/geyser/EncoderGeyser.js";

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
  widget:
    display_name: "&bWidget"
    resource: { material: PAPER, model_path: item/widget_flat }
`);

    // models
    w(path.join(asset, "models", "block", "cube_block.json"), JSON.stringify({ parent: "minecraft:block/cube_all", textures: { all: "test:block/cube_block" } }));
    w(path.join(asset, "models", "block", "glass_block.json"), JSON.stringify({ parent: "minecraft:block/cube_all", textures: { all: "test:block/glass_block" } }));
    w(path.join(asset, "models", "block", "plant.json"), JSON.stringify({ parent: "minecraft:block/cross", textures: { cross: "test:block/plant" } }));
    w(path.join(asset, "models", "item", "widget_flat.json"), JSON.stringify({ parent: "minecraft:item/generated", textures: { layer0: "test:item/widget" } }));

    // textures
    for (const t of ["cube_block", "glass_block", "plant"]) w(path.join(asset, "textures", "block", `${t}.png`), PNG);
    w(path.join(asset, "textures", "item", "widget.png"), PNG);
});

afterAll(() => {
    try { fs.rmSync(path.dirname(contentsDir), { recursive: true, force: true }); } catch { /* ignore */ }
});

// 注入的 stub 几何（mc-model-geo 单独测；这里只测转换器映射逻辑）
const geometryConvert = (m: any, o: any) => {
    const parent = String(m?.parent || "").split(":").pop();
    if (parent === "item/generated") return { geometry: undefined, materials: {}, isItemSprite: true };
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
    ],
    itemOverrides: [
        { baseMaterial: "minecraft:paper", customModelData: 5001, model: "test:item/widget_flat" },
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

    it("物品映射：base material + CMD，无同名方块则不加 _item", () => {
        const pack = GeyserConverter.convert(GENERATED as any, { namespace: "test", contentsDir, geometryConvert: geometryConvert as any });
        expect(pack.items.length).toBe(1);
        expect(pack.items[0].baseMaterial).toBe("minecraft:paper");
        expect(pack.items[0].customModelData).toBe(5001);
        expect(pack.items[0].name).toBe("widget");
        expect(pack.items[0].displayName).toBe("Widget");
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
        // 物品分组
        expect(mapping.items["minecraft:paper"].length).toBe(1);
    });
});
