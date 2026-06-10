// 把 GeyserPack 写盘：custom_mappings/<ns>.json + 基岩 RP 目录 + RP zip。
//   out/
//     custom_mappings/<ns>.json
//     <ns>_geyser_rp/{manifest.json, models/blocks/*.geo.json, textures/{blocks,items}/*, terrain_texture.json, item_texture.json}
//     <ns>_geyser.zip

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { zipDirectory } from "../../utils/archive.js";
import {
    GeyserPack, GeyserMappingFile, GeyserBlockMapping, GeyserItemMapping, GeyserBlockStateComponents,
} from "../../typings/geyser.js";

function ensureDir(p: string) { fs.mkdirSync(p, { recursive: true }); }
function writeJson(file: string, obj: unknown) {
    ensureDir(path.dirname(file));
    fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

export interface EncodeGeyserOptions {
    outDir: string;
    packName?: string;
    packVersion?: [number, number, number];
    minEngineVersion?: [number, number, number];
}

export const EncoderGeyser = {
    async encode(pack: GeyserPack, opts: EncodeGeyserOptions): Promise<{ mappingFile: string; rpZip: string }> {
        const { namespace } = pack;
        const outDir = opts.outDir;
        const minEngine = opts.minEngineVersion ?? [1, 16, 0];
        const packVersion = opts.packVersion ?? [1, 0, 0];
        const rpDir = path.join(outDir, `${namespace}_geyser_rp`);

        // ---------- custom_mappings/<ns>.json ----------
        const mapping: GeyserMappingFile = { format_version: 1 };

        // items 按 base material 分组
        if (pack.items.length) {
            mapping.items = {};
            for (const it of pack.items) {
                const arr = (mapping.items[it.baseMaterial] ??= []);
                const entry: GeyserItemMapping = {
                    name: it.name,
                    icon: it.icon,
                    custom_model_data: it.customModelData,
                };
                if (it.displayName) entry.display_name = it.displayName;
                if (it.allowOffhand) entry.allow_offhand = true;
                arr.push(entry);
            }
        }

        // blocks 按 host 分组（同 host 多状态 → state_overrides）
        if (pack.blocks.length) {
            mapping.blocks = {};
            const byHost = new Map<string, typeof pack.blocks>();
            for (const b of pack.blocks) {
                (byHost.get(b.hostBlock) ?? byHost.set(b.hostBlock, []).get(b.hostBlock)!).push(b);
            }
            for (const [host, group] of byHost) {
                const first = group[0];
                const components = (b: typeof first): GeyserBlockStateComponents => {
                    const c: GeyserBlockStateComponents = {
                        geometry: b.geometryId,
                        material_instances: b.materialInstances,
                    };
                    if (b.selectionBox) c.selection_box = b.selectionBox;
                    if (typeof b.destructibleByMining === "number") c.destructible_by_mining = b.destructibleByMining;
                    if (typeof b.lightEmission === "number") c.light_emission = b.lightEmission;
                    if (typeof b.lightDampening === "number") c.light_dampening = b.lightDampening;
                    return c;
                };
                const blockMapping: GeyserBlockMapping = {
                    name: first.name,
                    ...(first.displayName ? { display_name: first.displayName } : {}),
                    ...components(first),
                    only_override_states: true,
                    state_overrides: {},
                };
                for (const b of group) {
                    blockMapping.state_overrides![b.stateKey] = components(b);
                }
                mapping.blocks[host] = blockMapping;
            }
        }

        const mappingFile = path.join(outDir, "custom_mappings", `${namespace}.json`);
        writeJson(mappingFile, mapping);

        // ---------- 基岩 RP ----------
        if (fs.existsSync(rpDir)) fs.rmSync(rpDir, { recursive: true, force: true });
        ensureDir(rpDir);

        // manifest
        writeJson(path.join(rpDir, "manifest.json"), {
            format_version: 2,
            header: {
                name: opts.packName ?? `${namespace} Geyser RP`,
                description: `Auto-generated from ItemsAdder (${namespace})`,
                uuid: uuidv4(),
                version: packVersion,
                min_engine_version: minEngine,
            },
            modules: [{ type: "resources", uuid: uuidv4(), version: packVersion }],
        });

        // geometries
        for (const g of pack.geometries) {
            const base = g.id.split(".").pop() || g.id;
            writeJson(path.join(rpDir, "models", "blocks", `${base}.geo.json`), g.content);
        }

        // textures + terrain/item texture 索引
        const terrain: Record<string, { textures: string }> = {};
        const itemTex: Record<string, { textures: string }> = {};
        for (const t of pack.textures) {
            const dest = path.join(rpDir, t.bedrockPath + ".png");
            ensureDir(path.dirname(dest));
            fs.writeFileSync(dest, t.content);
            if (t.kind === "block") terrain[t.key] = { textures: t.bedrockPath };
            else itemTex[t.key] = { textures: t.bedrockPath };
        }
        if (Object.keys(terrain).length) {
            writeJson(path.join(rpDir, "textures", "terrain_texture.json"), {
                resource_pack_name: namespace, texture_name: "atlas.terrain", padding: 8, num_mip_levels: 4,
                texture_data: terrain,
            });
        }
        if (Object.keys(itemTex).length) {
            writeJson(path.join(rpDir, "textures", "item_texture.json"), {
                resource_pack_name: namespace, texture_name: "atlas.items",
                texture_data: itemTex,
            });
        }

        // zip
        const rpZip = path.join(outDir, `${namespace}_geyser.zip`);
        await zipDirectory(rpDir, rpZip);

        return { mappingFile, rpZip };
    },
};
