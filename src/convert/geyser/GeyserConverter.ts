// 组装 GeyserPack：GeneratedAssets(真相源) + IA 源 resourcepack/config + 注入的几何 provider
//   → blocks / items / geometries / textures 中间模型，交 EncoderGeyser 写盘。

import { GeneratedAssets } from "../../parser/itemsadder/ParserItemsAdderGenerated.js";
import { ParserItemsAdderItemsPack } from "../../parser/itemsadder/ParserItemsAdderItemsPack.js";
import {
    GeyserPack, GeyserBlockEntry, GeyserItemEntry,
    GeyserGeometryAsset, GeyserTextureAsset, GeyserMaterialInstance, GeometryConvert,
} from "../../typings/geyser.js";
import { toGeyserStateKey, modelBaseName } from "./blockstateResolver.js";
import { loadJavaModel, loadTexturePng, stripColorCodes } from "./sourceAssets.js";

export interface GeyserConvertOptions {
    namespace: string;
    contentsDir: string;            // .../plugins/ItemsAdder/contents
    geometryConvert: GeometryConvert;
}

const FULL_BLOCK_GEO = "minecraft:geometry.full_block";

export const GeyserConverter = {
    convert(generated: GeneratedAssets, opts: GeyserConvertOptions): GeyserPack {
        const { namespace, contentsDir, geometryConvert } = opts;

        // IA config：建立按 id / model_path 的索引
        const itemsPacks = ParserItemsAdderItemsPack.parse(contentsDir);
        const iaItems = itemsPacks[namespace]?.items ?? {};
        const byModelPath = new Map<string, { id: string; display_name?: string }>();
        for (const id in iaItems) {
            const mp = (iaItems[id] as any)?.resource?.model_path;
            if (typeof mp === "string") byModelPath.set(mp, { id, display_name: (iaItems[id] as any).display_name });
        }

        const pack: GeyserPack = { namespace, blocks: [], items: [], geometries: [], textures: [] };
        const geoSeen = new Set<string>();
        const texSeen = new Set<string>();
        const blockNames = new Set<string>();

        const addTexture = (texRef: string, kind: "block" | "item"): string => {
            const base = modelBaseName(texRef);
            const key = `${namespace}_${base}`;
            if (!texSeen.has(key)) {
                const png = loadTexturePng(contentsDir, texRef);
                if (png) {
                    pack.textures.push({
                        key,
                        bedrockPath: `textures/${kind === "block" ? "blocks" : "items"}/${base}`,
                        content: png,
                        kind,
                    });
                    texSeen.add(key);
                } else {
                    console.warn(`[geyser] 找不到贴图: ${texRef}`);
                }
            }
            return key;
        };

        // ===== 方块 =====
        for (const bs of generated.blockStates) {
            const baseName = modelBaseName(bs.model);
            const javaModel = loadJavaModel(contentsDir, bs.model);
            if (!javaModel) { console.warn(`[geyser] 找不到模型: ${bs.model}`); continue; }

            const identifier = `geometry.${namespace}.${baseName}`;
            const conv = geometryConvert(javaModel, { identifier });
            if (!conv || conv.isItemSprite) { console.warn(`[geyser] 几何转换跳过(未支持): ${bs.model}`); continue; }

            // 几何资源
            let geometryId: string;
            if (conv.geometry) {
                geometryId = identifier;
                if (!geoSeen.has(identifier)) {
                    pack.geometries.push({ id: identifier, content: conv.geometry });
                    geoSeen.add(identifier);
                }
            } else {
                geometryId = FULL_BLOCK_GEO; // 整方块用内置几何
            }

            // 材质实例 + 贴图
            const materialInstances: Record<string, GeyserMaterialInstance> = {};
            for (const face in conv.materials) {
                const m = conv.materials[face];
                if (!m.texture) continue;
                const key = addTexture(m.texture, "block");
                const inst: GeyserMaterialInstance = {
                    texture: key,
                    render_method: (m.render_method as any) || "opaque",
                };
                if (inst.render_method === "alpha_test") {
                    inst.face_dimming = false;
                    inst.ambient_occlusion = false;
                }
                materialInstances[face] = inst;
            }

            if (Object.keys(materialInstances).length === 0) {
                console.warn(`[geyser] 无可用材质，跳过方块: ${bs.model}`);
                continue;
            }

            const iaItem = iaItems[baseName] as any;
            // IA 方块选项：新 schema behaviours.block / 旧 schema specific_properties.block 都兼容
            const blockOpts = iaItem?.behaviours?.block ?? iaItem?.specific_properties?.block;
            const placedType: string | undefined = blockOpts?.placed_model?.type;
            const isTransparent = placedType === "REAL_TRANSPARENT";

            // 透明块：覆盖渲染方式为 blend，并标记不遮光
            if (isTransparent) {
                for (const face in materialInstances) {
                    materialInstances[face].render_method = "blend";
                    materialInstances[face].face_dimming = false;
                }
            }
            const isPlant = Object.values(materialInstances).some(m => m.render_method === "alpha_test");

            const entry: GeyserBlockEntry = {
                hostBlock: bs.hostBlock,
                name: baseName,
                displayName: iaItem?.display_name ? stripColorCodes(iaItem.display_name) : undefined,
                stateKey: toGeyserStateKey(bs.rawVariant),
                geometryId,
                materialInstances,
            };
            // 硬度 → 挖掘时间（不给则 Geyser 默认 MAX≈不可破，必须映射）
            if (typeof blockOpts?.hardness === "number") entry.destructibleByMining = blockOpts.hardness;
            // 发光等级 → light_emission
            if (typeof blockOpts?.light_level === "number" && blockOpts.light_level > 0) {
                entry.lightEmission = Math.min(15, blockOpts.light_level);
            }
            // 透明块不遮光
            if (isTransparent) entry.lightDampening = 0;
            // 植物/十字给细选择框（与手搓验证包一致）
            if (isPlant) entry.selectionBox = { origin: [-6, 0, -6], size: [12, 16, 12] };

            pack.blocks.push(entry);
            blockNames.add(baseName);
        }

        // ===== 物品 =====
        for (const ov of generated.itemOverrides) {
            const modelPath = ov.model.includes(":") ? ov.model.slice(ov.model.indexOf(":") + 1) : ov.model;
            const iaMatch = byModelPath.get(modelPath);
            const itemId = iaMatch?.id ?? modelBaseName(ov.model);

            // 取物品图标贴图：读物品模型的 layer0
            const itemModel = loadJavaModel(contentsDir, ov.model);
            const layer0 = itemModel?.textures?.layer0;
            if (!layer0) { console.warn(`[geyser] 物品模型无 layer0: ${ov.model}`); continue; }
            const iconKey = addTexture(layer0, "item");

            // 命名：与方块同名则加 _item 后缀，避免基岩标识符冲突
            const name = blockNames.has(itemId) ? `${itemId}_item` : itemId;

            const entry: GeyserItemEntry = {
                baseMaterial: ov.baseMaterial,
                name,
                displayName: iaMatch?.display_name ? stripColorCodes(iaMatch.display_name) : undefined,
                icon: iconKey,
                customModelData: ov.customModelData,
                allowOffhand: true,
            };
            pack.items.push(entry);
        }

        return pack;
    },
};
