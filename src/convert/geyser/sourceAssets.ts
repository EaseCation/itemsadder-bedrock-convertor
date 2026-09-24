// IA 源资源解析：优先 contents 的未篡改 resourcepack，其次回退 generated.zip。
//   contents/<ns>/resourcepack/assets/<ns>/...   ← 手工维护的源（对 ecsb/武器等完整）
//   generated.zip  assets/<ns>/...               ← IA 生成期产物（ia_auto 模型/贴图只存在于此）
// 引用形如 "ecsb:block/swamp_plant"；IA 的 ia_auto 会把贴图改写成内部图集序号 "ia:<n>"。

import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

function refParts(ref: string): { ns: string; rel: string } {
    const colon = ref.indexOf(":");
    if (colon < 0) return { ns: "minecraft", rel: ref };
    return { ns: ref.slice(0, colon), rel: ref.slice(colon + 1) };
}

/** contents 根目录下，命名空间 ns 的 resourcepack assets 根 */
function assetsRoot(contentsDir: string, packNs: string, assetNs: string): string {
    return path.join(contentsDir, packNs, "resourcepack", "assets", assetNs);
}

/**
 * generated.zip 的按需读取器（次级真相源）。
 * IA 的 generated.zip 带反解压保护，严格 zip 库会 CRC 失败，故与 parser 一致走系统 unzip；
 * 条目清单缓存一次，单条目读取结果也缓存，避免重复起进程。
 */
export class GeneratedZipAssets {
    private index?: Set<string>;
    private cache = new Map<string, Buffer | undefined>();

    constructor(private readonly zipPath: string) {}

    has(relPath: string): boolean {
        if (!this.index) {
            try {
                const listed = execFileSync("unzip", ["-Z1", this.zipPath], { maxBuffer: 512 * 1024 * 1024 });
                this.index = new Set(listed.toString("utf-8").split("\n").map((s) => s.trim()).filter(Boolean));
            } catch {
                this.index = new Set();
            }
        }
        return this.index.has(relPath);
    }

    read(relPath: string): Buffer | undefined {
        if (this.cache.has(relPath)) return this.cache.get(relPath);
        let buf: Buffer | undefined;
        if (this.has(relPath)) {
            try {
                buf = execFileSync("unzip", ["-p", this.zipPath, relPath], { maxBuffer: 256 * 1024 * 1024 });
            } catch {
                buf = undefined; // 个别条目损坏时按缺失处理，由调用方告警
            }
        }
        this.cache.set(relPath, buf);
        return buf;
    }
}

/** 解析 Java 模型 JSON。modelRef 如 "ecsb:block/swamp_plant" */
export function loadJavaModel(contentsDir: string, modelRef: string, zip?: GeneratedZipAssets): any | undefined {
    const { ns, rel } = refParts(modelRef);
    const file = path.join(assetsRoot(contentsDir, ns, ns), "models", `${rel}.json`);
    if (fs.existsSync(file)) {
        try {
            return JSON.parse(fs.readFileSync(file, "utf-8"));
        } catch {
            return undefined;
        }
    }
    const raw = zip?.read(`assets/${ns}/models/${rel}.json`);
    if (!raw) return undefined;
    try {
        return JSON.parse(raw.toString("utf-8"));
    } catch {
        return undefined;
    }
}

/** 解析贴图 PNG 字节。texRef 如 "ecsb:block/swamp_plant" */
export function loadTexturePng(contentsDir: string, texRef: string, zip?: GeneratedZipAssets): Buffer | undefined {
    const { ns, rel } = refParts(texRef);
    const file = path.join(assetsRoot(contentsDir, ns, ns), "textures", `${rel}.png`);
    if (fs.existsSync(file)) {
        try {
            return fs.readFileSync(file);
        } catch {
            return undefined;
        }
    }
    return zip?.read(`assets/${ns}/textures/${rel}.png`);
}

/**
 * IA 的 ia_auto 把贴图引用改写成内部图集序号（如 "ia:464"），该序号在 generated.zip 内
 * 没有可反查的索引。实测 ia_auto 的模型 basename 与同命名空间贴图名一一对应
 * （ores_and_more 56/56 校验通过），故用 basename 回退；解析结果仍会做存在性校验。
 */
export function resolveIndirectTextureRef(texRef: string, namespace: string, modelBaseName: string): string {
    if (texRef && texRef.startsWith("ia:")) return `${namespace}:${modelBaseName}`;
    return texRef;
}

/** 去除 Minecraft 颜色/格式代码（& 与 § 形式），用于 display_name */
export function stripColorCodes(s: string): string {
    return s.replace(/[&§][0-9a-fk-or]/gi, "");
}

// bedrock_pack 原样搬运（passthrough）已移到 ParserItemsAdderGenerated.extractBedrockPack：
// 改从 generated.zip 的合并 bedrock_pack 全树读（与 IA 实际打进 Java/VBU 端的内容一致，
// 且避开 contents 在并行开发时的半成品态），产单一合并基岩原生包，不再按命名空间扫 contents。
