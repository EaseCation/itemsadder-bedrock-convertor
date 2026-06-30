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

// ===== bedrock_pack 原样搬运（passthrough）=====
// IA 约定：contents/<ns>/resourcepack/assets/<assetNs>/bedrock_pack/ 下放基岩原生文件
//（粒子 particles/*.particle.json + textures/particle/*.png，及未来 animation_controllers
// /render_controllers/fog 等），由 IA merge 进 Java 端 RP；这里同样把整棵树原样搬进基岩 RP 根。

export interface BedrockPassthroughFile { relPath: string; content: Buffer; }

/** assets/ 根（遍历其下各 assetNs 找 bedrock_pack/，通常仅 minecraft） */
function assetsBaseDir(contentsDir: string, packNs: string): string {
    return path.join(contentsDir, packNs, "resourcepack", "assets");
}

/** 命名空间是否含 bedrock_pack/（廉价存在性判断，供跳过守卫用，不读文件内容） */
export function hasBedrockPack(contentsDir: string, packNs: string): boolean {
    const base = assetsBaseDir(contentsDir, packNs);
    if (!fs.existsSync(base)) return false;
    try {
        return fs.readdirSync(base).some(assetNs => {
            try { return fs.statSync(path.join(base, assetNs, "bedrock_pack")).isDirectory(); }
            catch { return false; }
        });
    } catch { return false; }
}

/**
 * 收集各 assetNs 下 bedrock_pack/ 全树为「原样搬运」文件列表。
 * relPath 相对各自 bedrock_pack 根（如 particles/ecsb_demo.particle.json），用 '/' 分隔。
 * 排除各 bedrock_pack 根的 manifest.json（convertor 自产 manifest，避免覆盖）。
 */
export function collectBedrockPassthrough(contentsDir: string, packNs: string): BedrockPassthroughFile[] {
    const base = assetsBaseDir(contentsDir, packNs);
    if (!fs.existsSync(base)) return [];
    const out: BedrockPassthroughFile[] = [];
    const walk = (dir: string, rel: string) => {
        let ents: fs.Dirent[];
        try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
        for (const ent of ents) {
            const abs = path.join(dir, ent.name);
            const r = rel ? `${rel}/${ent.name}` : ent.name;
            if (ent.isDirectory()) walk(abs, r);
            else if (ent.isFile()) {
                if (r === "manifest.json") continue; // 根 manifest 由 convertor 自产
                out.push({ relPath: r, content: fs.readFileSync(abs) });
            }
        }
    };
    let assetNsList: string[];
    try { assetNsList = fs.readdirSync(base); } catch { return out; }
    for (const assetNs of assetNsList) {
        const bpRoot = path.join(base, assetNs, "bedrock_pack");
        try { if (!fs.statSync(bpRoot).isDirectory()) continue; } catch { continue; }
        walk(bpRoot, "");
    }
    return out;
}
