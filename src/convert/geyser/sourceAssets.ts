// 从未篡改的 IA 源 resourcepack（contents/<ns>/resourcepack/assets/<ns>/...）按引用解析
// Java 模型 JSON 与贴图 PNG。model/texture 引用形如 "ecsb:block/swamp_plant"。

import fs from "fs";
import path from "path";

function refParts(ref: string): { ns: string; rel: string } {
    const colon = ref.indexOf(":");
    if (colon < 0) return { ns: "minecraft", rel: ref };
    return { ns: ref.slice(0, colon), rel: ref.slice(colon + 1) };
}

/** contents 根目录下，命名空间 ns 的 resourcepack assets 根 */
function assetsRoot(contentsDir: string, packNs: string, assetNs: string): string {
    return path.join(contentsDir, packNs, "resourcepack", "assets", assetNs);
}

/** 解析 Java 模型 JSON。modelRef 如 "ecsb:block/swamp_plant" */
export function loadJavaModel(contentsDir: string, modelRef: string): any | undefined {
    const { ns, rel } = refParts(modelRef);
    const file = path.join(assetsRoot(contentsDir, ns, ns), "models", `${rel}.json`);
    if (!fs.existsSync(file)) return undefined;
    try {
        return JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {
        return undefined;
    }
}

/** 解析贴图 PNG 字节。texRef 如 "ecsb:block/swamp_plant" */
export function loadTexturePng(contentsDir: string, texRef: string): Buffer | undefined {
    const { ns, rel } = refParts(texRef);
    const file = path.join(assetsRoot(contentsDir, ns, ns), "textures", `${rel}.png`);
    if (!fs.existsSync(file)) return undefined;
    try {
        return fs.readFileSync(file);
    } catch {
        return undefined;
    }
}

/** 去除 Minecraft 颜色/格式代码（& 与 § 形式），用于 display_name */
export function stripColorCodes(s: string): string {
    return s.replace(/[&§][0-9a-fk-or]/gi, "");
}
