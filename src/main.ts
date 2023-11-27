import path from "path";
import { EncoderBedrockResourcePack } from "./encoder/bedrock/EncoderBedrockResourcePack.js";
import { EncoderBedrockBehaviourPack } from "./encoder/bedrock/EncoderBedrockBehaviourPack.js";
import { Pack } from "./typings/pack";
import { RootConverter } from "./convert/RootConverter.js";
import { ParserItemsAdderFullPack } from "./parser/itemsadder/ParserItemsAdderFullPack.js";
import fs from "fs";
import { mergeBedrock } from "./utils/merge.js";
import { Parameters } from "./convert/Converter";
import { zipDirectory } from "./utils/archive.js";

const input_path = '/Users/fangyizhou/Documents/coding/Paper1.18.2/plugins/ItemsAdder/contents';

const parameter: Parameters = {
    furniture_force_entity: true,
    furniture_production: false,
};

const converts: Pack.BedrockFullPack[] = [];
const files = fs.readdirSync(input_path);
for (let file of files) {
    if (!fs.statSync(path.join(input_path, file)).isDirectory()) {
        continue;
    }
    if (file === '_iainternal') {
        continue;
    }
    const fullPack: Pack.ItemsAdderFullPack = ParserItemsAdderFullPack.parse(path.join(input_path, file));
    const converted = RootConverter.convertToBedrock(fullPack, parameter);
    if (converted) {
        converts.push(converted);
    }
}

// 合并导出
const converted: Pack.BedrockFullPack = mergeBedrock("easecation", converts);

if (converted) {
    converted.resourcePack.manifest = {
        format_version: 1,
            header: {
                name: "EaseCation Beautify",
                description: "EaseCation Beautify",
                uuid: "259b82a5-35d8-ff7c-9155-3f6099fa9d5c",
                version: [1, 0, 3],
                min_engine_version: [1, 16, 0]
        },
        modules: [
            {
                type: "resources",
                uuid: "7d579b93-4bb5-8ba4-957c-38acad5da36c",
                version: [1, 0, 3]
            }
        ]
    }
    converted.behaviourPack.manifest = {
        format_version: 1,
            header: {
                name: "EaseCation Beautify",
                description: "EaseCation Beautify",
                uuid: "3c60ebcb-732a-6002-e0b2-c3aa902bec13",
                version: [1, 0, 3],
                min_engine_version: [1, 16, 0]
        },
        modules: [
            {
                type: "data",
                uuid: "b64a76b9-9f85-d8b8-b3ed-cd0a04d96cb7",
                version: [1, 0, 3]
            }
        ]
    }
}
console.log(converted);

if (converted) {
    // encoder
    const targetPath = "/Users/fangyizhou/Library/Application Support/mcpelauncher/games/com.mojang/";
    EncoderBedrockResourcePack.encode(converted, path.join(targetPath, "development_resource_packs", "easecation"));
    EncoderBedrockBehaviourPack.encode(converted, path.join(targetPath, "development_behavior_packs", "easecation"));
    console.log("Encode completed!");

    const zipPath = "/Users/fangyizhou/Documents/coding/CodeFunCore/_server/plugins/ECProEntity";
    // 将这两个文件夹内的文件使用zip打包
    zipDirectory(path.join(targetPath, "development_resource_packs", "easecation"), path.join(zipPath, "easecation_res.zip")).then();
    zipDirectory(path.join(targetPath, "development_behavior_packs", "easecation"), path.join(zipPath, "easecation_beh.zip")).then();
    console.log("Zip completed!");
}

// 阻止程序退出
process.stdin.resume();