#!/usr/bin/env node
import fs from "fs";
import path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { v4 as uuidv4 } from "uuid";

import { ParserItemsAdderFullPack } from "./parser/itemsadder/ParserItemsAdderFullPack.js";
import { RootConverter } from "./convert/RootConverter.js";
import { mergeBedrock } from "./utils/merge.js";
import { Pack } from "./typings/pack.js";
import { Parameters } from "./convert/Converter.js";
import { EncoderBedrockResourcePack } from "./encoder/bedrock/EncoderBedrockResourcePack.js";
import { EncoderBedrockBehaviourPack } from "./encoder/bedrock/EncoderBedrockBehaviourPack.js";
import { zipDirectory, compressPngImages } from "./utils/archive.js";

/**
 * 将命令行传入的字符串版本号转为 [number, number, number]，默认为 [1, 0, 0]
 */
function parseVersion(versionStr?: string): [number, number, number] {
    if (!versionStr) return [1, 0, 0];
    const parts = versionStr.split(".");
    const major = parseInt(parts[0]) || 1;
    const minor = parseInt(parts[1]) || 0;
    const patch = parseInt(parts[2]) || 0;
    return [major, minor, patch];
}

/**
 * 生成 Manifest 对象的辅助函数
 */
function createManifest(options: {
    name?: string;
    description?: string;
    uuid?: string;
    version?: string;
    minEngineVersion?: [number, number, number];
    type: "resources" | "data";
}) {
    const manifestUuid = options.uuid || uuidv4();
    const manifestVersion = parseVersion(options.version);
    return {
        format_version: 1,
        header: {
            name: options.name || "My Addons Pack",
            description: options.description || "Auto-generated Addon",
            uuid: manifestUuid,
            version: manifestVersion,
            min_engine_version: options.minEngineVersion || [1, 16, 0],
        },
        modules: [
            {
                type: options.type,
                uuid: uuidv4(),
                version: manifestVersion,
            },
        ],
    };
}

async function main() {
    // 使用 yargs 解析命令行参数
    const argv = await yargs(hideBin(process.argv))
        .option("input-path", {
            type: "string",
            demandOption: true,
            describe: "ItemsAdder 资源文件夹路径",
        })
        .option("namespace", {
            type: "string",
            default: "easecation",
            describe: "生成的基岩版物品命名空间",
        })
        .option("resource-name", {
            type: "string",
            describe: "Resource Pack 的名称",
            default: "EaseCation Resource Pack",
        })
        .option("resource-description", {
            type: "string",
            describe: "Resource Pack 的描述",
            default: "Auto-generated Resource Pack",
        })
        .option("resource-uuid", {
            type: "string",
            describe: "Resource Pack 的 UUID (若不指定则随机生成)",
        })
        .option("resource-version", {
            type: "string",
            describe: "Resource Pack 的版本号 (格式: x.x.x)",
        })
        .option("behavior-name", {
            type: "string",
            describe: "Behavior Pack 的名称",
            default: "EaseCation Behavior Pack",
        })
        .option("behavior-description", {
            type: "string",
            describe: "Behavior Pack 的描述",
            default: "Auto-generated Behavior Pack",
        })
        .option("behavior-uuid", {
            type: "string",
            describe: "Behavior Pack 的 UUID (若不指定则随机生成)",
        })
        .option("behavior-version", {
            type: "string",
            describe: "Behavior Pack 的版本号 (格式: x.x.x)",
        })
        .option("output-resource", {
            type: "string",
            default: "./output_res",
            describe: "Resource Pack 输出路径",
        })
        .option("output-behavior", {
            type: "string",
            default: "./output_beh",
            describe: "Behavior Pack 输出路径",
        })
        .option("png-compress", {
            type: "boolean",
            default: false,
            describe: "是否压缩 PNG 图片",
        })
        .option("zip-output-resource", {
            type: "string",
            default: "./zip/resource_pack.zip",
            describe: "打包资源包 zip 文件的输出目录",
        })
        .option("zip-output-behavior", {
            type: "string",
            default: "./zip/behavior_pack.zip",
            describe: "打包行为包 zip 文件的输出目录",
        })
        .option("furniture-force-entity", {
            type: "boolean",
            default: true,
            describe: "furniture_force_entity 参数",
        })
        .option("furniture-production", {
            type: "boolean",
            default: true,
            describe: "furniture_production 参数",
        })
        .help()
        .alias("h", "help")
        .parseAsync();

    const inputPath = argv["input-path"];
    const parameter: Parameters = {
        furniture_force_entity: argv["furniture-force-entity"],
        furniture_production: argv["furniture-production"],
    };

    // 读取输入目录
    const files = fs.readdirSync(inputPath);
    const converts: Pack.BedrockFullPack[] = [];

    for (let file of files) {
        const fullPath = path.join(inputPath, file);
        if (!fs.statSync(fullPath).isDirectory()) {
            continue;
        }
        // 跳过 _iainternal
        if (file === "_iainternal") {
            continue;
        }
        // 解析 ItemsAdder FullPack
        const fullPack: Pack.ItemsAdderFullPack = ParserItemsAdderFullPack.parse(fullPath);
        // 转换为 Bedrock Pack
        const converted = await RootConverter.convertToBedrock(fullPack, parameter);
        if (converted) {
            converts.push(converted);
        }
    }

    // 合并多个转换结果到一个命名空间里
    const namespace = argv.namespace;
    const mergedFullPack: Pack.BedrockFullPack = mergeBedrock(namespace, converts);

    if (!mergedFullPack) {
        console.error("未生成可用的资源包，请检查输入内容。");
        return;
    }

    // 创建 ResourcePack manifest
    mergedFullPack.resourcePack.manifest = createManifest({
        name: argv["resource-name"],
        description: argv["resource-description"],
        uuid: argv["resource-uuid"],
        version: argv["resource-version"],
        minEngineVersion: [1, 16, 0], // 或自行根据需求配置
        type: "resources",
    });

    // 创建 BehaviorPack manifest
    mergedFullPack.behaviourPack.manifest = createManifest({
        name: argv["behavior-name"],
        description: argv["behavior-description"],
        uuid: argv["behavior-uuid"],
        version: argv["behavior-version"],
        minEngineVersion: [1, 16, 0],
        type: "data",
    });

    // 输出路径
    const pngCompress = argv['png-compress']
    const outputResPath = argv["output-resource"];
    const outputBehPath = argv["output-behavior"];
    const zipOutputResourcePath = argv["zip-output-resource"];
    const zipOutputBehaviourPath = argv["zip-output-behavior"];

    // 编码输出到指定目录
    EncoderBedrockResourcePack.encode(mergedFullPack, outputResPath);
    EncoderBedrockBehaviourPack.encode(mergedFullPack, outputBehPath);
    console.log(`✅ 资源已输出到: \nResourcePack: ${outputResPath}\nBehaviorPack: ${outputBehPath}`);

    // 如果需要可以进行 png 压缩
    if (pngCompress) {
        await compressPngImages(outputResPath);
    }

    // 将两个文件夹打包为 zip
    if (zipOutputResourcePath) {
        const zipOutputPath = path.dirname(zipOutputResourcePath);
        if (!fs.existsSync(zipOutputPath)) {
            fs.mkdirSync(zipOutputPath, { recursive: true });
        }
        await zipDirectory(outputResPath, zipOutputResourcePath);
        console.log(`✅ 已生成 资源包 zip 打包文件到: ${zipOutputResourcePath}`);
    }
    if (zipOutputBehaviourPath) {
        const zipOutputPath = path.dirname(zipOutputBehaviourPath);
        if (!fs.existsSync(zipOutputPath)) {
            fs.mkdirSync(zipOutputPath,)
        }
        await zipDirectory(outputBehPath, zipOutputBehaviourPath);
        console.log(`✅ 已生成 行为包 zip 打包文件到: ${zipOutputBehaviourPath}`);
    }

    // 阻止 node 进程退出（可选，如果你想让脚本持续运行）
    // process.stdin.resume();
}

// 主函数执行
main().catch((error) => {
    console.error(error);
    process.exit(1);
});