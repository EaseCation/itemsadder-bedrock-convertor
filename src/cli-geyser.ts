// IA → Geyser 转换 + 部署 CLI（通用、参数化）
//
//   node dist/cli-geyser.js \
//     --ia-contents <ItemsAdder/contents 目录>        (必填)
//     [--generated <generated.zip>]                   默认 <ia-contents>/../output/generated.zip
//     [--namespace <ns[,ns2,...] | all>]              默认 all（自动检测所有内容命名空间）
//     [--out <输出目录>]                              默认 ./out
//     [--deploy-geyser <Geyser 数据目录>]             给定则部署到 <dir>/custom_mappings 与 <dir>/packs/ResourcePacks
//     [--pack-version x.y.z]                          默认 1.0.0（升版本可强制基岩客户端重下）
//     [--min-engine-version x.y.z]                    默认 1.16.0
//
// 几何转换走 mc-model-geo 库；自定义命名空间的 parent 从 IA 源 resourcepack 解析。

import fs from "fs";
import path from "path";
import { convertModel } from "mc-model-geo";
import { ParserItemsAdderGenerated } from "./parser/itemsadder/ParserItemsAdderGenerated.js";
import { GeyserConverter } from "./convert/geyser/GeyserConverter.js";
import { EncoderGeyser } from "./encoder/geyser/EncoderGeyser.js";
import { loadJavaModel } from "./convert/geyser/sourceAssets.js";
import { GeometryConvert } from "./typings/geyser.js";

function parseArgs(argv: string[]): Record<string, string> {
    const out: Record<string, string> = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith("--")) {
            const key = a.slice(2);
            const val = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "true";
            out[key] = val;
        }
    }
    return out;
}

function parseVersion(s: string | undefined, def: [number, number, number]): [number, number, number] {
    if (!s) return def;
    const p = s.split(".").map(n => parseInt(n, 10));
    return [p[0] || def[0], p[1] || def[1], p[2] || def[2]];
}

/** 自动检测内容命名空间：contents 下含 configs/ 子目录、且非内部目录 */
function detectNamespaces(contentsDir: string): string[] {
    return fs.readdirSync(contentsDir)
        .filter(name => name !== "_iainternal" && !name.startsWith("."))
        .filter(name => {
            const p = path.join(contentsDir, name);
            return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, "configs"));
        });
}

/** 部署到 Geyser：mapping → custom_mappings/，RP zip → packs/ResourcePacks/（先清同名旧 zip） */
function deployToGeyser(geyserDir: string, namespace: string, mappingFile: string, rpZip: string): void {
    const cmDir = path.join(geyserDir, "custom_mappings");
    const rpDir = path.join(geyserDir, "packs", "ResourcePacks");
    fs.mkdirSync(cmDir, { recursive: true });
    fs.mkdirSync(rpDir, { recursive: true });
    fs.copyFileSync(mappingFile, path.join(cmDir, `${namespace}.json`));
    const zipName = path.basename(rpZip);
    fs.copyFileSync(rpZip, path.join(rpDir, zipName));
    console.log(`[deploy] ${namespace}: custom_mappings/${namespace}.json + packs/ResourcePacks/${zipName}`);
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const contentsDir = args["ia-contents"];
    if (!contentsDir) {
        console.error("用法: cli-geyser --ia-contents <dir> [--generated <zip>] [--namespace <ns|all>] [--out <dir>] [--deploy-geyser <dir>] [--pack-version x.y.z] [--min-engine-version x.y.z]");
        process.exit(1);
    }
    const generatedZip = args["generated"] ?? path.join(path.dirname(contentsDir), "output", "generated.zip");
    const outDir = args["out"] ?? "./out";
    const deployDir = args["deploy-geyser"];
    const packVersion = parseVersion(args["pack-version"], [1, 0, 0]);
    const minEngine = parseVersion(args["min-engine-version"], [1, 16, 0]);

    const nsArg = args["namespace"];
    const namespaces = (!nsArg || nsArg === "all" || nsArg === "true")
        ? detectNamespaces(contentsDir)
        : nsArg.split(",").map(s => s.trim()).filter(Boolean);

    console.log(`[geyser] contents=${contentsDir}`);
    console.log(`[geyser] generated.zip=${generatedZip}`);
    console.log(`[geyser] 命名空间: ${namespaces.join(", ") || "(无)"}`);

    // 几何转换：mc-model-geo；自定义命名空间 parent 从 IA 源解析
    const geometryConvert: GeometryConvert = (javaModel, o) => convertModel(javaModel, {
        identifier: o.identifier,
        textureSize: o.textureSize,
        resolveParent: (parentId: string) =>
            (parentId.startsWith("minecraft:") || !parentId.includes(":"))
                ? null
                : (loadJavaModel(contentsDir, parentId) ?? null),
    });

    let totalBlocks = 0, totalItems = 0, produced = 0;
    for (const namespace of namespaces) {
        const generated = ParserItemsAdderGenerated.parse(generatedZip, namespace);
        if (generated.blockStates.length === 0 && generated.itemOverrides.length === 0) {
            console.log(`[geyser] ${namespace}: 无自定义方块/物品，跳过`);
            continue;
        }
        const pack = GeyserConverter.convert(generated, { namespace, contentsDir, geometryConvert });
        if (pack.blocks.length === 0 && pack.items.length === 0) {
            console.log(`[geyser] ${namespace}: 转换后无产物，跳过`);
            continue;
        }
        const res = await EncoderGeyser.encode(pack, {
            outDir, packName: `${namespace} (IA→Geyser)`, packVersion, minEngineVersion: minEngine,
        });
        totalBlocks += pack.blocks.length;
        totalItems += pack.items.length;
        produced++;
        console.log(`[geyser] ${namespace}: blocks=${pack.blocks.length} items=${pack.items.length} geo=${pack.geometries.length} tex=${pack.textures.length}`);
        if (deployDir) deployToGeyser(deployDir, namespace, res.mappingFile, res.rpZip);
    }

    console.log(`[geyser] 完成：${produced} 个命名空间，共 blocks=${totalBlocks} items=${totalItems}，输出于 ${outDir}`);
    if (deployDir) console.log(`[geyser] 已部署到 ${deployDir} —— 重启 Geyser/代理后基岩端重连生效。`);
}

main().catch(e => { console.error(e); process.exit(1); });
