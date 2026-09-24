// 组装 GeyserPack：GeneratedAssets(真相源) + IA 源 resourcepack/config + 注入的几何 provider
//   → blocks / items / geometries / textures 中间模型，交 EncoderGeyser 写盘。

import fs from "fs";
import path from "path";
import { GeneratedAssets } from "../../parser/itemsadder/ParserItemsAdderGenerated.js";
import { ParserItemsAdderItemsPack } from "../../parser/itemsadder/ParserItemsAdderItemsPack.js";
import {
    GeyserPack, GeyserBlockEntry, GeyserItemEntry,
    GeyserGeometryAsset, GeyserTextureAsset, GeyserMaterialInstance, GeometryConvert,
} from "../../typings/geyser.js";
import { toGeyserStateKey, modelBaseName } from "./blockstateResolver.js";
import {
    loadJavaModel, loadTexturePng, stripColorCodes, GeneratedZipAssets, resolveIndirectTextureRef,
} from "./sourceAssets.js";
import { buildWeaponAttachable, WeaponPoseOverride } from "./weaponAttachable.js";

export interface GeyserConvertOptions {
    namespace: string;
    contentsDir: string;            // .../plugins/ItemsAdder/contents
    generatedZip?: string;          // IA 的 output/generated.zip（ia_auto 模型/贴图的次级真相源）
    geometryConvert: GeometryConvert;
    weaponPoses?: Record<string, WeaponPoseOverride>;  // 按武器 name 的姿态微调覆盖（可选）
}

const FULL_BLOCK_GEO = "minecraft:geometry.full_block";

/** 读人工武器 2D icon（Blockbench 截图 + square_icon），约定目录 contents/<ns>/geyser_icons/<name>.png */
function loadWeaponIcon(contentsDir: string, namespace: string, name: string): Buffer | undefined {
    const p = path.join(contentsDir, namespace, "geyser_icons", `${name}.png`);
    try { return fs.readFileSync(p); } catch { return undefined; }
}

export const GeyserConverter = {
    convert(generated: GeneratedAssets, opts: GeyserConvertOptions): GeyserPack {
        const { namespace, contentsDir, geometryConvert } = opts;
        const weaponPoses = opts.weaponPoses ?? {};
        const zipAssets = opts.generatedZip ? new GeneratedZipAssets(opts.generatedZip) : undefined;

        // IA config：建立按 id / model_path 的索引
        const itemsPacks = ParserItemsAdderItemsPack.parse(contentsDir);
        const iaItems = itemsPacks[namespace]?.items ?? {};
        const byModelPath = new Map<string, { id: string; display_name?: string; item: any }>();
        for (const id in iaItems) {
            const mp = (iaItems[id] as any)?.resource?.model_path;
            if (typeof mp === "string") {
                byModelPath.set(mp, { id, display_name: (iaItems[id] as any).display_name, item: iaItems[id] });
            }
        }

        const pack: GeyserPack = { namespace, blocks: [], items: [], geometries: [], textures: [], attachables: [], animations: [], passthrough: [] };
        const geoSeen = new Set<string>();
        const texSeen = new Set<string>();
        const blockNames = new Set<string>();

        const addTexture = (texRef: string, kind: "block" | "item"): string => {
            const base = modelBaseName(texRef);
            const key = `${namespace}_${base}`;
            // 同一张贴图可能同时被方块面和物品图标引用；terrain/item 是两个独立索引文件，
            // 必须各自登记，否则物品图标会指向只存在于 terrain_texture.json 的键。
            const seenKey = `${kind}:${key}`;
            if (!texSeen.has(seenKey)) {
                const png = loadTexturePng(contentsDir, texRef, zipAssets);
                if (png) {
                    pack.textures.push({
                        key,
                        bedrockPath: `textures/${kind === "block" ? "blocks" : "items"}/${base}`,
                        content: png,
                        kind,
                    });
                    texSeen.add(seenKey);
                } else {
                    console.warn(`[geyser] 找不到贴图: ${texRef}`);
                }
            }
            return key;
        };

        // ===== 方块 =====
        for (const bs of generated.blockStates) {
            const baseName = modelBaseName(bs.model);
            const javaModel = loadJavaModel(contentsDir, bs.model, zipAssets);
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
                const key = addTexture(resolveIndirectTextureRef(m.texture, namespace, baseName), "block");
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

            const modelPath = bs.model.includes(":") ? bs.model.slice(bs.model.indexOf(":") + 1) : bs.model;
            const iaItem = (byModelPath.get(modelPath)?.item ?? iaItems[baseName]) as any;
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
            const isMmoItemsBlockSkin = String(iaItem?.mmoitem?.type ?? "").toUpperCase() === "BLOCK" && !blockOpts;
            if (isMmoItemsBlockSkin) entry.destructibleByMining = -1;
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
            // ia_auto 物品在 IA 配置里没有 resource.model_path（如 ores_and_more），
            // 按模型 basename 直接匹配物品 id（方块分支已有同款回退），否则 display_name 会丢。
            const byPath = byModelPath.get(modelPath);
            const fallbackId = modelBaseName(ov.model);
            const fallbackItem = byPath ? undefined : (iaItems as any)[fallbackId];
            const iaMatch = byPath ?? (fallbackItem
                ? { id: fallbackId, display_name: fallbackItem.display_name, item: fallbackItem }
                : undefined);
            const itemId = iaMatch?.id ?? fallbackId;

            const itemModel = loadJavaModel(contentsDir, ov.model, zipAssets);
            if (!itemModel) { console.warn(`[geyser] 找不到物品模型: ${ov.model}`); continue; }

            const baseName = modelBaseName(ov.model);
            // 命名：与方块同名则加 _item 后缀，避免基岩标识符冲突
            const name = blockNames.has(itemId) ? `${itemId}_item` : itemId;
            const displayName = iaMatch?.display_name ? stripColorCodes(iaMatch.display_name) : undefined;
            const layer0Raw = itemModel?.textures?.layer0;
            const layer0 = layer0Raw ? resolveIndirectTextureRef(layer0Raw, namespace, baseName) : layer0Raw;

            // 武器型识别：无 layer0 但含 elements（3D 手持模型）→ 烘焙 attachable 三件套
            const isWeapon = !layer0 && Array.isArray(itemModel.elements) && itemModel.elements.length > 0;
            if (isWeapon) {
                const identifier = `geometry.${namespace}.${baseName}`;
                const conv = geometryConvert(itemModel, { identifier, textureSize: itemModel.texture_size });
                if (!conv || !conv.geometry || conv.isItemSprite) {
                    console.warn(`[geyser] 武器几何转换失败: ${ov.model}`); continue;
                }
                // 几何贴图：首个非 particle 纹理（被 attachable textures.default 直接引用，不进 item_texture）
                let geoTexRef: string | undefined;
                for (const k in (itemModel.textures ?? {})) {
                    if (k === "particle") continue;
                    geoTexRef = (itemModel.textures as any)[k]; break;
                }
                if (!geoTexRef) { console.warn(`[geyser] 武器无几何贴图: ${ov.model}`); continue; }
                geoTexRef = resolveIndirectTextureRef(geoTexRef, namespace, baseName);
                const geoBase = modelBaseName(geoTexRef);
                const geoTexPath = `textures/items/${geoBase}`;
                const geoSeenKey = `geo:${geoTexPath}`;
                if (!texSeen.has(geoSeenKey)) {
                    const png = loadTexturePng(contentsDir, geoTexRef, zipAssets);
                    if (png) {
                        pack.textures.push({ key: `${namespace}_${geoBase}__geo`, bedrockPath: geoTexPath, content: png, kind: "item-geometry" });
                        texSeen.add(geoSeenKey);
                    } else console.warn(`[geyser] 武器几何贴图找不到: ${geoTexRef}`);
                }

                const built = buildWeaponAttachable({
                    name, identifier, ns: "heypixel",
                    texture: geoTexPath, rawGeometry: conv.geometry, javaModel: itemModel,
                    pose: weaponPoses[name],
                });
                pack.geometries.push({ id: identifier, content: built.geometry, kind: "entity" });
                pack.attachables.push({ name, content: built.attachable });
                pack.animations.push({ name, content: built.animation });

                // 2D inventory icon（人工 Blockbench 截图，约定目录 contents/<ns>/geyser_icons/<name>.png）
                const iconKey = `${namespace}_${baseName}`;
                const iconSeenKey = `icon:${iconKey}`;
                if (!texSeen.has(iconSeenKey)) {
                    const iconPng = loadWeaponIcon(contentsDir, namespace, name);
                    if (iconPng) {
                        pack.textures.push({ key: iconKey, bedrockPath: `textures/items/${name}_icon`, content: iconPng, kind: "item" });
                        texSeen.add(iconSeenKey);
                    } else {
                        console.warn(`[geyser] 武器缺人工 icon（contents/${namespace}/geyser_icons/${name}.png）: ${name}`);
                    }
                }

                pack.items.push({
                    baseMaterial: ov.baseMaterial, name, displayName,
                    icon: iconKey, customModelData: ov.customModelData,
                    allowOffhand: false, displayHandheld: true,
                });
                continue;
            }

            // ===== 普通 sprite 物品 =====
            // 方块物品：IA 的 REAL_NOTE / REAL 系列物品，其物品模型就是方块模型（无 layer0）。
            // 取模型首个非 particle 纹理当图标，否则基岩端只能显示原版材质。
            let spriteRef: string | undefined = typeof layer0 === "string" ? layer0 : undefined;
            if (!spriteRef) {
                const parent = typeof itemModel?.parent === "string" ? itemModel.parent : "";
                const looksLikeBlockModel = parent.includes("block/") || Array.isArray(itemModel?.elements);
                if (!looksLikeBlockModel) {
                    console.warn(`[geyser] 物品模型无 layer0 且非武器: ${ov.model}`);
                    continue;
                }
                for (const k in (itemModel.textures ?? {})) {
                    if (k === "particle") continue;
                    spriteRef = resolveIndirectTextureRef((itemModel.textures as any)[k], namespace, baseName);
                    break;
                }
            }
            if (!spriteRef) { console.warn(`[geyser] 物品模型无可用贴图: ${ov.model}`); continue; }
            const iconKey = addTexture(spriteRef, "item");
            const entry: GeyserItemEntry = {
                baseMaterial: ov.baseMaterial,
                name,
                displayName,
                icon: iconKey,
                customModelData: ov.customModelData,
                allowOffhand: false,
            };
            pack.items.push(entry);
        }

        // bedrock_pack 原样搬运不在此处：改由 cli-geyser 从 generated.zip 合并提取，产单一基岩原生包。
        return pack;
    },
};
