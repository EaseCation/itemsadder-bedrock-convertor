import { IPackEncoder } from "../IPackEncoder.js";
import { Pack } from "../../typings/pack";
import fs from "fs-extra";
import path from "path";
import { BlockBehavior } from "../../typings/bedrock/schemas/blocks/blocks";
import { Item } from "../../typings/bedrock/schemas/items/1.10.0/items";
import { randomUUID } from "crypto";

export const EncoderBedrockBehaviourPack: IPackEncoder<Pack.BedrockFullPack> = {

    encode(pack: Pack.BedrockFullPack, targetPath: string): void {
        const behaviourPack = pack.behaviourPack;
        // 如果path已存在，则删除
        if (fs.existsSync(targetPath)) {
            fs.removeSync(targetPath);
        }
        // 创建文件夹
        fs.mkdirSync(targetPath);

        // 创建manifest.json
        if (!behaviourPack.manifest) {
            console.warn("manifest.json of behaviour pack not found, create a new one.");
            behaviourPack.manifest = {
                format_version: 1,
                header: {
                    name: pack.namespace,
                    description: "",
                    uuid: randomUUID(),
                    version: [1, 0, 0],
                    min_engine_version: [1, 16, 0]
                },
                modules: [
                    {
                        type: "data",
                        uuid: randomUUID(),
                        version: [1, 0, 0]
                    }
                ]
            }
        }

        // 创建manifest.json
        fs.createFileSync(path.join(targetPath, "manifest.json"));
        fs.writeFileSync(path.join(targetPath, "manifest.json"), JSON.stringify(behaviourPack.manifest, null, 2));

        // blocks
        if (behaviourPack.blocks.length > 0) {
            fs.mkdirSync(path.join(targetPath, "blocks"));
            for (let block of behaviourPack.blocks) {
                const blockFile: BlockBehavior = {
                    format_version: "1.19.60",
                    "minecraft:block": block
                }
                const fileName = block.description.identifier.split(":").pop() + ".block.json";
                fs.createFileSync(path.join(targetPath, "blocks", fileName))
                fs.writeFileSync(path.join(targetPath, "blocks", fileName), JSON.stringify(blockFile, null, 2));
            }
        }
        // items
        if (behaviourPack.items.length > 0) {
            fs.mkdirSync(path.join(targetPath, "items"));
            for (let item of behaviourPack.items) {
                const itemFile: Item = {
                    format_version: "1.10.0",
                    "minecraft:item": item
                }
                const fileName = item.description.identifier.split(":").pop() + ".item.json";
                fs.createFileSync(path.join(targetPath, "items", fileName));
                fs.writeFileSync(path.join(targetPath, "items", fileName), JSON.stringify(itemFile, null, 2));
            }
        }
        // entities
        if (Object.keys(behaviourPack.entities).length > 0) {
            fs.mkdirSync(path.join(targetPath, "entities"));
            for (let entity in behaviourPack.entities) {
                fs.createFileSync(path.join(targetPath, "entities", entity.split(":").pop() + ".entity.json"));
                const serverEntity = {
                    format_version: "1.19.20",
                    "minecraft:entity": behaviourPack.entities[entity]
                }
                fs.writeFileSync(path.join(targetPath, "entities", entity.split(":").pop() + ".entity.json"), JSON.stringify(serverEntity, null, 2));
            }
        }
    }

}