import { Pack } from "../typings/pack";

export const mergeBedrock = (namespace: string, packs: Pack.BedrockFullPack[]): Pack.BedrockFullPack => {
    const result: Pack.BedrockFullPack = {
        namespace: namespace,
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
    for (let pack of packs) {
        // entity
        for (let key in pack.resourcePack.entities) {
            const entity = pack.resourcePack.entities[key];
            result.resourcePack.entities[key] = entity;
        }
        // models
        for (let model of pack.resourcePack.models) {
            result.resourcePack.models.push(model);
        }
        // textures
        for (let texture of pack.resourcePack.textures) {
            result.resourcePack.textures.push(texture);
        }
        // blocks
        for (let key in pack.resourcePack.blocks) {
            const block = pack.resourcePack.blocks[key];
            result.resourcePack.blocks[key] = block;
        }
        // terrainTextures
        result.resourcePack.terrainTextures.texture_data = {
            ...result.resourcePack.terrainTextures.texture_data,
            ...pack.resourcePack.terrainTextures.texture_data
        }
        // texts
        for (let key in pack.resourcePack.texts) {
            const texts = pack.resourcePack.texts[key];
            for (let textKey in texts) {
                const text = texts[textKey];
                result.resourcePack.texts[key][textKey] = text;
            }
        }
        // blocks
        for (let block of pack.behaviourPack.blocks) {
            result.behaviourPack.blocks.push(block);
        }
        // items
        for (let item of pack.behaviourPack.items) {
            result.behaviourPack.items.push(item);
        }
        // entities
        for (let entityKey in pack.behaviourPack.entities) {
            const entity = pack.behaviourPack.entities[entityKey];
            result.behaviourPack.entities[entityKey] = entity;
        }
    }
    return result;
}