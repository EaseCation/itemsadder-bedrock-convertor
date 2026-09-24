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
//     [--modui-base <ec_ui.zip>]                      合并 generated.zip 的 minecraft/textures/ui
//     [--modui-backup-dir <dir>]                      部署 ModUI 包前保存旧包
//     [--modui-only]                                  只构建/部署 ModUI，不转换其他命名空间
//
// 几何转换走 mc-model-geo 库；自定义命名空间的 parent 从 IA 源 resourcepack 解析。

import fs from "fs";
import path from "path";
import { convertModel } from "mc-model-geo";
import { ParserItemsAdderGenerated, extractBedrockPack } from "./parser/itemsadder/ParserItemsAdderGenerated.js";
import { GeyserConverter } from "./convert/geyser/GeyserConverter.js";
import { EncoderGeyser } from "./encoder/geyser/EncoderGeyser.js";
import { buildModUiPack, deployModUiPack } from "./encoder/geyser/ModUiPackBuilder.js";
import { loadJavaModel } from "./convert/geyser/sourceAssets.js";
import { GeometryConvert, GeyserPack } from "./typings/geyser.js";

// 合并基岩原生包名：generated.zip 里各命名空间的 bedrock_pack 已被 IA 合并成一棵树，
// 故产单一包（粒子等基岩原生文件）。无 mapping，不入 custom_mappings/。
const BEDROCK_PACK_NAME = "ecsb_bedrock";

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

function versionString(version: [number, number, number]): string {
    return version.join(".");
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

/** 部署到 Geyser：mapping → custom_mappings/（仅当有方块/物品），RP zip → packs/ResourcePacks/（先清同名旧 zip） */
function deployToGeyser(geyserDir: string, namespace: string, mappingFile: string, rpZip: string, hasMappings: boolean): void {
    const cmDir = path.join(geyserDir, "custom_mappings");
    const rpDir = path.join(geyserDir, "packs", "ResourcePacks");
    fs.mkdirSync(rpDir, { recursive: true });
    const zipName = path.basename(rpZip);
    fs.copyFileSync(rpZip, path.join(rpDir, zipName));
    if (hasMappings) {
        fs.mkdirSync(cmDir, { recursive: true });
        fs.copyFileSync(mappingFile, path.join(cmDir, `${namespace}.json`));
        console.log(`[deploy] ${namespace}: custom_mappings/${namespace}.json + packs/ResourcePacks/${zipName}`);
    } else {
        // 纯 passthrough 包（如粒子）无 mapping，只发资源包
        console.log(`[deploy] ${namespace}: packs/ResourcePacks/${zipName}（纯 passthrough，无 mapping）`);
    }
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const contentsDir = args["ia-contents"];
    if (!contentsDir) {
        console.error("用法: cli-geyser --ia-contents <dir> [--generated <zip>] [--namespace <ns|all>] [--out <dir>] [--deploy-geyser <dir>] [--pack-version x.y.z] [--min-engine-version x.y.z] [--modui-base <ec_ui.zip>] [--modui-backup-dir <dir>] [--modui-only]");
        process.exit(1);
    }
    const generatedZip = args["generated"] ?? path.join(path.dirname(contentsDir), "output", "generated.zip");
    const outDir = args["out"] ?? "./out";
    const deployDir = args["deploy-geyser"];
    const packVersion = parseVersion(args["pack-version"], [1, 0, 0]);
    const minEngine = parseVersion(args["min-engine-version"], [1, 16, 0]);
    const modUiBase = args["modui-base"];
    const modUiOnly = args["modui-only"] === "true";
    const modUiBackupDir = args["modui-backup-dir"];
    if (modUiOnly && !modUiBase) throw new Error("--modui-only requires --modui-base");
    if (modUiBase && deployDir && !modUiBackupDir) {
        throw new Error("deploying ModUI requires --modui-backup-dir");
    }

    const nsArg = args["namespace"];
    const namespaces = modUiOnly ? [] : (!nsArg || nsArg === "all" || nsArg === "true")
        ? detectNamespaces(contentsDir)
        : nsArg.split(",").map(s => s.trim()).filter(Boolean);

    console.log(`[geyser] contents=${contentsDir}`);
    console.log(`[geyser] generated.zip=${generatedZip}`);
    console.log(`[geyser] 命名空间: ${modUiOnly ? "(仅 ModUI)" : namespaces.join(", ") || "(无)"}`);

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
    if (!modUiOnly) {
        for (const namespace of namespaces) {
            const generated = ParserItemsAdderGenerated.parse(generatedZip, namespace);
            if (generated.blockStates.length === 0 && generated.itemOverrides.length === 0) {
                console.log(`[geyser] ${namespace}: 无自定义方块/物品，跳过`);
                continue;
            }
            const pack = GeyserConverter.convert(generated, { namespace, contentsDir, geometryConvert, generatedZip });
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
            if (deployDir) deployToGeyser(deployDir, namespace, res.mappingFile, res.rpZip, true);
        }

        // generated.zip 中合并的 bedrock_pack 原样转换成单一基岩原生包。
        const bedrockFiles = extractBedrockPack(generatedZip);
        if (bedrockFiles.length > 0) {
            const bpPack: GeyserPack = {
                namespace: BEDROCK_PACK_NAME,
                blocks: [], items: [], geometries: [], textures: [], attachables: [], animations: [],
                passthrough: bedrockFiles,
            };
            const res = await EncoderGeyser.encode(bpPack, {
                outDir, packName: `${BEDROCK_PACK_NAME} (IA bedrock_pack)`, packVersion, minEngineVersion: minEngine,
            });
            produced++;
            const kinds = new Set(bedrockFiles.map(f => f.relPath.split("/")[0]));
            console.log(`[geyser] ${BEDROCK_PACK_NAME}: bedrock_pack 原生文件 ${bedrockFiles.length}（${[...kinds].join("/")}）`);
            if (deployDir) deployToGeyser(deployDir, BEDROCK_PACK_NAME, res.mappingFile, res.rpZip, false);
        } else {
            console.log(`[geyser] generated.zip 无 bedrock_pack 原生文件，跳过基岩原生包（如需粒子请先 /iazip）`);
        }
    }

    if (modUiBase) {
        const targetPack = deployDir
            ? path.join(deployDir, "packs", "ResourcePacks", "ec_ui.zip")
            : undefined;
        const modUi = await buildModUiPack({
            basePack: modUiBase,
            generatedZip,
            currentPack: args["modui-current"] ?? targetPack,
            outDir,
        });
        if (modUi.changed && modUi.outputPack) {
            produced++;
            console.log(`[geyser] ec_ui: files=${modUi.totalFileCount} overlay=${modUi.overlayFileCount} version=${versionString(modUi.version)}`);
            if (targetPack) {
                const deployed = deployModUiPack(modUi.outputPack, targetPack, modUiBackupDir!);
                console.log(`[deploy] ec_ui: packs/ResourcePacks/ec_ui.zip (${deployed.size} bytes, sha256=${deployed.sha256})`);
                if (deployed.backupPack) console.log(`[deploy] ec_ui backup: ${deployed.backupPack}`);
            }
        } else {
            console.log(`[geyser] ec_ui 已是最新内容：overlay=${modUi.overlayFileCount} version=${versionString(modUi.version)}`);
        }
    }

    console.log(`[geyser] 完成：${produced} 个包，共 blocks=${totalBlocks} items=${totalItems}，输出于 ${outDir}`);
    if (deployDir) console.log(`[geyser] 已部署到 ${deployDir} —— 重启 Geyser/代理后基岩端重连生效。`);
}

main().catch(e => { console.error(e); process.exit(1); });
