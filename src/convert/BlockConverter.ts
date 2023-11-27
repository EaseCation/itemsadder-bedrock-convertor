import { Context, Converter } from "./Converter";
import { Item } from "../typings/itemsadder/schemas";
import { ItemsAdderPack } from "../typings/itemsadder/itemsadderpack";
import WithId = ItemsAdderPack.WithId;
import { BedrockPack } from "../typings/bedrock/bedrockpack";
import path from "path";

export const BlockConverter: Converter<BedrockPack.Block, WithId<Item>> = {

    convertToBedrock(item: WithId<Item>, context?: Context): BedrockPack.Block | undefined {
        if (!context) {
            return undefined;
        }
        const block: BedrockPack.Block = {
            behaviour: {
                description: {
                    identifier: `${context.namespace}:${item.id}`,
                    // @ts-ignore
                    menu_category: {
                        category: "construction",
                    },
                    /*traits: {
                        "minecraft:placement_direction": {
                            "enabled_states": ["minecraft:cardinal_direction"],
                            "y_rotation_offset": 90
                        }
                    }*/
                },
                components: {}
            },
            resource: {
                id: `${context.namespace}:${item.id}`
            },
            terrain: {}
        }
        if (item.display_name) {
            block.text = item.display_name;
        }
        if (item.resource?.generate && item.resource.textures) {
            const textures = item.resource.textures as string[];
            if (textures.length === 1) {
                // 单面的
                block.terrain[`${item.id}`] = { textures: path.join("textures", textures[0].split(".")[0]) };
                block.resource.textures = item.id;
                // 从原始包中寻找texture
                const texture = context.fullPackItemsAdder.resourcePack.textures.find(texture => texture.relativePath === textures[0]);
                if (texture) {
                    context.fullPackBedrock.resourcePack.textures.push({...texture, path: path.join("textures", texture.relativePath)});
                }
            } else {
                // 多面的
                block.resource.textures = {}
                for (let i = 0; i < textures.length; i++) {
                    const texture = textures[i];
                    block.terrain[`${item.id}_${i}`] = { textures: path.join("textures", texture.split(".")[0]) };
                    // 从原始包中寻找texture
                    const textureOrigin = context.fullPackItemsAdder.resourcePack.textures.find(t => t.relativePath === texture);
                    if (textureOrigin) {
                        context.fullPackBedrock.resourcePack.textures.push({...textureOrigin, path: path.join("textures", textureOrigin.relativePath)});
                    }
                    switch (i) {
                        case 0:
                            block.resource.textures.down = `${item.id}_${i}`;
                            break;
                        case 1:
                            block.resource.textures.east = `${item.id}_${i}`;
                            break;
                        case 2:
                            block.resource.textures.north = `${item.id}_${i}`;
                            break;
                        case 3:
                            block.resource.textures.south = `${item.id}_${i}`;
                            break;
                        case 4:
                            block.resource.textures.up = `${item.id}_${i}`;
                            break;
                        case 5:
                            block.resource.textures.west = `${item.id}_${i}`;
                            break;
                    }
                }
            }
        }
        if (item.specific_properties?.block) {
            // sound
            if (item.specific_properties.block.sound) {
                if (item.specific_properties.block.sound.break) {
                    block.resource.sound = item.specific_properties.block.sound.break.name;
                } else if (item.specific_properties.block.sound.place) {
                    block.resource.sound = item.specific_properties.block.sound.place.name;
                }
            }
        }
        return block;
    },

    convertToJava(block: BedrockPack.Block, context?: Context): WithId<Item> | undefined {
        return undefined;
    }

}