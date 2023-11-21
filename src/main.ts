import path from "path";
import { ParserItemsAdderItemsPack } from "./parser/itemsadder/ParserItemsAdderItemsPack.js";
import { ParserItemsAdderResourcePack } from "./parser/itemsadder/ParserItemsAdderResourcePack.js";
import { EncoderBedrockResourcePack } from "./encoder/bedrock/EncoderBedrockResourcePack.js";
import { EncoderBedrockBehaviourPack } from "./encoder/bedrock/EncoderBedrockBehaviourPack.js";
import { Pack } from "./typings/pack";
import { RootConverter } from "./convert/RootConverter.js";

const input_path = '/Users/fangyizhou/Downloads/data';

const itemsPacks = ParserItemsAdderItemsPack.parse(path.join(input_path, "items_packs"));
console.log(itemsPacks);
const resourcePacks = ParserItemsAdderResourcePack.parse(path.join(input_path, "resource_pack"));
console.log(resourcePacks);

// 只取第一个
const fullPack: Pack.ItemsAdderFullPack = {
    namespace: Object.values(itemsPacks)[0].namespace,
    resourcePack: Object.values(resourcePacks)[0],
    itemsPack: Object.values(itemsPacks)[0],
}

const converted = RootConverter.convertToBedrock(fullPack);
if (converted) {
    converted.resourcePack.manifest = {
        format_version: 1,
            header: {
                name: "Park plus",
                description: "Park plus",
                uuid: "0d177635-f021-4c3b-9881-bbe36e3e1422",
                version: [1, 0, 0],
                min_engine_version: [1, 16, 0]
        },
        modules: [
            {
                type: "resources",
                uuid: "1ba68d83-552d-417c-937c-981384f6136b",
                version: [1, 0, 0]
            }
        ]
    }
    converted.behaviourPack.manifest = {
        format_version: 1,
            header: {
                name: "Park plus",
                description: "Park plus",
                uuid: "d43d01da-59eb-4f8c-abd8-54d6c1faef13",
                version: [1, 0, 0],
                min_engine_version: [1, 16, 0]
        },
        modules: [
            {
                type: "data",
                uuid: "7727d2c7-abe1-4c6b-9592-860cbc948717",
                version: [1, 0, 0]
            }
        ]
    }
}
console.log(converted);

if (converted) {
    // encoder
    const targetPath = "/Users/fangyizhou/Library/Application Support/mcpelauncher/games/com.mojang/";
    EncoderBedrockResourcePack.encode(converted, path.join(targetPath, "development_resource_packs", "park_plus"));
    EncoderBedrockBehaviourPack.encode(converted, path.join(targetPath, "development_behavior_packs", "park_plus"));
    console.log("Encode completed!");
}

// 阻止程序退出
process.stdin.resume();