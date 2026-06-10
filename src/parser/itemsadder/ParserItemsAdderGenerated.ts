// 读取 ItemsAdder 生成的资源包 output/generated.zip（权威真相源）
//
// 提取两类映射：
//  1) 自定义方块：assets/minecraft/blockstates/<host>.json 里 model 指向自定义命名空间的 variant
//     → { hostBlock: "minecraft:<host>", rawVariant, model }
//  2) 自定义物品：assets/minecraft/models/item/<material>.json 的 overrides[]
//     → { baseMaterial: "minecraft:<material>", customModelData, model }
//
// 注意：IA 的 generated.zip 带"反解压保护"——连真实文件的 zip 描述符也被篡改，
// 导致 adm-zip 等严格库对全部条目 CRC 校验失败。系统 `unzip` 可容错解出，
// 因此这里 shell out 到 `unzip` 仅提取所需的少量 minecraft 命名空间 JSON 映射。
// 模型/贴图本体不从此 zip 取，而从未篡改的 IA 源 resourcepack 读。

import { execFileSync } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { isCustomModel } from "../../convert/geyser/blockstateResolver.js";

export interface GeneratedBlockState {
    hostBlock: string;   // minecraft:tripwire
    rawVariant: string;  // IA 原始 variant 串（未排序）
    model: string;       // ecsb:block/swamp_plant
}

export interface GeneratedItemOverride {
    baseMaterial: string;     // minecraft:string
    customModelData: number;  // 10000
    model: string;            // ecsb:item/swamp_plant_flat
}

export interface GeneratedAssets {
    blockStates: GeneratedBlockState[];
    itemOverrides: GeneratedItemOverride[];
}

function extractVariantModels(value: unknown): string[] {
    const out: string[] = [];
    if (Array.isArray(value)) {
        for (const v of value) {
            if (v && typeof v === "object" && typeof (v as any).model === "string") out.push((v as any).model);
        }
    } else if (value && typeof value === "object" && typeof (value as any).model === "string") {
        out.push((value as any).model);
    }
    return out;
}

function safeParseFile(file: string): any | undefined {
    try {
        return JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
        return undefined;
    }
}

/** 用系统 unzip 容错提取指定 glob 到临时目录，返回临时目录路径 */
function extractEntries(zipPath: string, globs: string[]): string {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ia-gen-"));
    try {
        // -o 覆盖、-q 安静；不匹配的 glob 会让 unzip 返回 11，容错忽略
        execFileSync("unzip", ["-o", "-q", zipPath, ...globs, "-d", tmp], { stdio: "ignore" });
    } catch {
        // 部分 glob 未匹配或个别条目损坏时 unzip 返回非 0；已提取的文件仍可用
    }
    return tmp;
}

function walkJsonFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
        .filter(f => f.endsWith(".json"))
        .map(f => path.join(dir, f));
}

export const ParserItemsAdderGenerated = {
    /**
     * @param zipPath output/generated.zip 路径
     * @param namespace 可选：只认该命名空间的自定义内容
     */
    parse(zipPath: string, namespace?: string): GeneratedAssets {
        const blockStates: GeneratedBlockState[] = [];
        const itemOverrides: GeneratedItemOverride[] = [];

        const tmp = extractEntries(zipPath, [
            "assets/minecraft/blockstates/*.json",
            "assets/minecraft/models/item/*.json",
        ]);

        try {
            // ---- 自定义方块状态 ----
            const bsDir = path.join(tmp, "assets", "minecraft", "blockstates");
            for (const file of walkJsonFiles(bsDir)) {
                const host = path.basename(file, ".json");
                const json = safeParseFile(file);
                if (!json || !json.variants || typeof json.variants !== "object") continue;
                for (const rawVariant of Object.keys(json.variants)) {
                    for (const model of extractVariantModels(json.variants[rawVariant])) {
                        if (isCustomModel(model, namespace)) {
                            blockStates.push({ hostBlock: `minecraft:${host}`, rawVariant, model });
                        }
                    }
                }
            }

            // ---- 自定义物品 overrides ----
            const itemDir = path.join(tmp, "assets", "minecraft", "models", "item");
            for (const file of walkJsonFiles(itemDir)) {
                const material = path.basename(file, ".json");
                const json = safeParseFile(file);
                if (!json || !Array.isArray(json.overrides)) continue;
                for (const ov of json.overrides) {
                    if (!ov || typeof ov !== "object") continue;
                    const model = (ov as any).model;
                    const cmd = (ov as any).predicate?.custom_model_data;
                    if (typeof model === "string" && typeof cmd === "number" && isCustomModel(model, namespace)) {
                        itemOverrides.push({ baseMaterial: `minecraft:${material}`, customModelData: cmd, model });
                    }
                }
            }
        } finally {
            try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* ignore */ }
        }

        return { blockStates, itemOverrides };
    },
};
