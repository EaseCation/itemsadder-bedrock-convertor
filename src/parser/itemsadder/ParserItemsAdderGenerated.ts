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

// bedrock_pack 原样搬运文件（粒子等基岩原生文件，从 generated.zip 提取）
export interface BedrockPassthroughFile {
    relPath: string;   // 相对 bedrock_pack 根，如 particles/x.particle.json（'/' 分隔）
    content: Buffer;   // 原始字节（JSON / PNG / …）
}

export interface ModUiAssetFile {
    relPath: string;   // 基岩包内路径，固定以 textures/ui/ 开头
    content: Buffer;
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

/** 递归把目录下文件收集为 {relPath, content}（relPath 相对 baseDir，'/' 分隔），排除根 manifest.json */
function collectTree(dir: string, rel: string, out: BedrockPassthroughFile[]): void {
    let ents: fs.Dirent[];
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const ent of ents) {
        const abs = path.join(dir, ent.name);
        const r = rel ? `${rel}/${ent.name}` : ent.name;
        if (ent.isDirectory()) collectTree(abs, r, out);
        else if (ent.isFile()) {
            if (r === "manifest.json") continue;   // convertor 自产 manifest
            out.push({ relPath: r, content: fs.readFileSync(abs) });
        }
    }
}

/**
 * 从 generated.zip 提取合并后的 bedrock_pack 全树（IA 在打包时把各命名空间的
 * `assets/<ns>/bedrock_pack/` 合并到 `assets/<assetNs>/bedrock_pack/`，通常 minecraft）。
 *
 * 返回每个文件 { relPath, content }，relPath 相对各自 bedrock_pack 根
 * （如 `particles/x.particle.json`、`textures/particle/x.png`），排除根 manifest.json。
 *
 * 同 parse() 走系统 unzip 容错解压——绕开 IA「反解压保护」对严格 zip 库的破坏。
 * 已逐字节核验 bedrock_pack 内容不被该保护篡改（JSON/PNG md5 与 contents 源一致）。
 */
export function extractBedrockPack(zipPath: string): BedrockPassthroughFile[] {
    const out: BedrockPassthroughFile[] = [];
    // unzip 的 `*` 匹配含 `/`，故该 glob 递归命中任意 assets/<ns>/bedrock_pack/ 下全部文件
    const tmp = extractEntries(zipPath, ["assets/*/bedrock_pack/*"]);
    try {
        const assetsRoot = path.join(tmp, "assets");
        if (!fs.existsSync(assetsRoot)) return out;
        for (const assetNs of fs.readdirSync(assetsRoot)) {
            const bpRoot = path.join(assetsRoot, assetNs, "bedrock_pack");
            try { if (!fs.statSync(bpRoot).isDirectory()) continue; } catch { continue; }
            collectTree(bpRoot, "", out);
        }
    } finally {
        try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* ignore */ }
    }
    return out;
}

/**
 * 从 generated.zip 提取 Java ModUI 贴图树，并映射成基岩包中的 textures/ui/**。
 * 只读取该前缀，manifest、字体、声音和 UI 控制 JSON 都不会进入覆盖层。
 */
export function extractModUiAssets(zipPath: string): ModUiAssetFile[] {
    const out: ModUiAssetFile[] = [];
    const tmp = extractEntries(zipPath, ["assets/minecraft/textures/ui/*"]);
    try {
        const uiRoot = path.join(tmp, "assets", "minecraft", "textures", "ui");
        const extracted: BedrockPassthroughFile[] = [];
        collectTree(uiRoot, "", extracted);
        for (const file of extracted) {
            out.push({ relPath: `textures/ui/${file.relPath}`, content: file.content });
        }
    } finally {
        try { fs.rmSync(tmp, { recursive: true, force: true }); } catch { /* ignore */ }
    }
    return out;
}
