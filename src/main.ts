import path from "path";
import { EncoderBedrockResourcePack } from "./encoder/bedrock/EncoderBedrockResourcePack.js";
import { EncoderBedrockBehaviourPack } from "./encoder/bedrock/EncoderBedrockBehaviourPack.js";
import { Pack } from "./typings/pack";
import { RootConverter } from "./convert/RootConverter.js";
import { ParserItemsAdderFullPack } from "./parser/itemsadder/ParserItemsAdderFullPack.js";

const input_path = '/Users/fangyizhou/Downloads/Christmas_Pack_Furnitures/ItemsAdder/contents/christmas_pack_fur';

// 只取第一个
const fullPack: Pack.ItemsAdderFullPack = ParserItemsAdderFullPack.parse(input_path);
console.log(fullPack);

const converted = RootConverter.convertToBedrock(fullPack/*, {furniture_force_entity: true}*/);
if (converted) {
    converted.resourcePack.manifest = {
        format_version: 1,
            header: {
                name: "christmas_pack_fur",
                description: "christmas_pack_fur",
                uuid: "0d177635-f021-4c3b-9881-bbe36e3e1423",
                version: [1, 0, 0],
                min_engine_version: [1, 16, 0]
        },
        modules: [
            {
                type: "resources",
                uuid: "1ba68d83-552d-417c-937c-981384f6136c",
                version: [1, 0, 0]
            }
        ]
    }
    converted.behaviourPack.manifest = {
        format_version: 1,
            header: {
                name: "christmas_pack_fur",
                description: "christmas_pack_fur",
                uuid: "d43d01da-59eb-4f8c-abd8-54d6c1faef14",
                version: [1, 0, 0],
                min_engine_version: [1, 16, 0]
        },
        modules: [
            {
                type: "data",
                uuid: "7727d2c7-abe1-4c6b-9592-860cbc948718",
                version: [1, 0, 0]
            }
        ]
    }
}
console.log(converted);

if (converted) {
    // encoder
    const targetPath = "/Users/fangyizhou/Library/Application Support/mcpelauncher/games/com.mojang/";
    EncoderBedrockResourcePack.encode(converted, path.join(targetPath, "development_resource_packs", "christmas_pack_fur"));
    EncoderBedrockBehaviourPack.encode(converted, path.join(targetPath, "development_behavior_packs", "christmas_pack_fur"));
    console.log("Encode completed!");
}

// 阻止程序退出
process.stdin.resume();