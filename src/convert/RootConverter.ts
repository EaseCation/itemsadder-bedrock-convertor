import { Context, Parameters } from "./Converter";
import { Pack } from "../typings/pack";
import { FurnitureConverter } from "./FurnitureConverter.js";
import { ModelConverter } from "./ModelConverter.js";
import { BlockConverter } from "./BlockConverter.js";

export const RootConverter = {

    convertToBedrock(pack: Pack.ItemsAdderFullPack, parameter?: Parameters): Pack.BedrockFullPack | undefined {
        const result: Pack.BedrockFullPack = {
            namespace: pack.namespace,
            resourcePack: {
                models: [],
                textures: [],
                entities: {},
                blocks: {},
                terrainTextures: {
                    texture_data: {}
                },
                texts: {
                    "en_US": {}
                }
            },
            behaviourPack: {
                blocks: [],
                items: [],
                entities: {}
            }
        }
        const context: Context  = {
            namespace: pack.namespace,
            fullPackBedrock: result,
            fullPackItemsAdder: pack,
            parameters: parameter
        }
        // ===== ResourcePack =====
        // models
        for (let model of pack.resourcePack.models) {
            const convert = ModelConverter.convertToBedrock(model);
            if (convert) {
                result.resourcePack.models.push(convert);
            }
        }
        // textures 由具体的Block和Entity转换时添加
        /*for (let texture of pack.resourcePack.textures) {
            result.resourcePack.textures.push(texture);
        }*/
        // ===== ItemsPack =====
        // items
        if (pack.itemsPack.items) {
            for (let key in pack.itemsPack.items) {
                const item = pack.itemsPack.items[key];
                if (item.behaviours && item.behaviours.furniture) {
                    // furniture 家具
                    const furniture = FurnitureConverter.convertToBedrock(item, context);
                    if (furniture) {
                        if (furniture.block.text) {
                            result.resourcePack.texts['en_US'][`tile.${furniture.block.behaviour.description.identifier}.name`] = furniture.block.text;
                        }
                        result.behaviourPack.blocks.push(furniture.block.behaviour);
                        const { id, ...resourceWithoutId } = furniture.block.resource;
                        result.resourcePack.blocks[furniture.block.resource.id] = resourceWithoutId;
                        result.resourcePack.terrainTextures.texture_data = {
                            ...result.resourcePack.terrainTextures.texture_data,
                            ...furniture.block.terrain
                        }
                        if (furniture.entity) {
                            result.resourcePack.entities[furniture.entity.resource.description.identifier] = furniture.entity.resource;
                            result.behaviourPack.entities[furniture.entity.resource.description.identifier] = furniture.entity.behaviour;
                        }
                    }
                } else if (item.specific_properties && item.specific_properties.block) {
                    // block 纯方块
                    // furniture 家具
                    const block = BlockConverter.convertToBedrock(item, context);
                    if (block) {
                        if (block.text) {
                            result.resourcePack.texts['en_US'][`tile.${block.behaviour.description.identifier}.name`] = block.text;
                        }
                        result.behaviourPack.blocks.push(block.behaviour);
                        const { id, ...resourceWithoutId } = block.resource;
                        result.resourcePack.blocks[block.resource.id] = resourceWithoutId;
                        result.resourcePack.terrainTextures.texture_data = {
                            ...result.resourcePack.terrainTextures.texture_data,
                            ...block.terrain
                        }
                    }
                }
            }
        }
        return result;
    },

    convertToJava(pack: Pack.BedrockFullPack, parameter?: Parameters): Pack.ItemsAdderFullPack | undefined {
        // TODO
        return undefined;
    }

}