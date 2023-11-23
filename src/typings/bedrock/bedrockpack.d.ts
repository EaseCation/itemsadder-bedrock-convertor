import { Geometry1160 } from "./schemas/models/entity/1.16.0/model_entity";
import { BlockDefinitions } from "./schemas/blocks/format/minecraft.block";
import { Item1 } from "./schemas/items/1.10.0/items";
import { Block as BEBlock } from "./schemas/blocks";
import { ItemsAdderPack } from "../itemsadder/itemsadderpack";
import WithId = ItemsAdderPack.WithId;
import { TerrainTextureFile, TextureData } from "./schemas/textures/terrain_texture";
import { ManifestV2Schema } from "./schemas/manifest/manifest.2";
import { ClientEntity } from "./schemas/entity/1.10.0/entity";

declare namespace BedrockPack {

    export type Model = {
        path: string,
        content: Geometry1160
    };

    export type Block = {
        behaviour: BlockDefinitions,
        resource: WithId<BEBlock>,
        text: string;
        terrain: TextureData
    }

    // 不知为何，没有现成的behaviour的type定义
    export type EntityBehaviour = {
        description: {
            identifier: string,
            is_spawnable?: boolean,
            is_summonable?: boolean
        },
        components: {
            "minecraft:physics"?: {
                has_collision: boolean,
                has_gravity: boolean
            },
            "minecraft:scale"?: {
                value: number
            },
            "minecraft:type_family"?: {
                family: string[]
            },
            "minecraft:movement"?: {
                value: number
            },
            "minecraft:movement.basic"?: {
                max_turn: number
            },
            "minecraft:knockback_resistance"?: {
                value: number
            },
            "minecraft:navigation.walk"?: {
                avoid_damage_blocks?: boolean,
                avoid_portals?: boolean,
                avoid_sun?: boolean,
                avoid_water?: boolean,
                blocks_to_avoid?: string[],
                can_breach?: boolean,
                can_break_doors?: boolean,
                can_float?: boolean,
                can_jump?: boolean,
                can_open_doors?: boolean,
                can_open_iron_doors?: boolean,
                can_pass_doors?: boolean,
                can_path_from_air?: boolean,
                can_path_over_lava?: boolean,
                can_path_over_water?: boolean,
                can_sink?: boolean,
                can_swim?: boolean,
                can_walk?: boolean,
                can_walk_in_lava?: boolean,
                is_amphibious?: boolean
            },
            "minecraft:is_baby"?: boolean,
            "minecraft:is_ignited"?: boolean,
            "minecraft:is_saddled"?: boolean,
            "minecraft:is_sheared"?: boolean,
            "minecraft:is_tamed"?: boolean,
            "minecraft:is_illager_captain"?: boolean,
            "minecraft:variant"?: number,
            "minecraft:mark_variant"?: number,
            "minecraft:skin_id"?: number,
            "minecraft:health"?: {
                value?: number,
                max?: number
            }
            [key: string]: any
        },
        component_groups?: {
            [key: string]: any,
        },
        events?: {
            [key: string]: any
        }
    }

    export type Entity = {
        resource: ClientEntity,
        behaviour: EntityBehaviour
    }

    // 家具有一些特殊，需要额外注册为实体
    export type Furniture = {
        block: Block,
        entity?: Entity
    }

    export type Texture = {
        dirPath: string,
        path: string,
        content: Buffer
    };

    // ResourcePack ===============

    export type ResourcePacks = {
        [namespace: string]: ResourcePack;
    }

    export type ResourcePack = {
        path?: string;
        manifest?: ManifestV2Schema;
        entities: {
            [id: string]: ClientEntity;
        }
        models: Model[];
        blocks: {
            [id: string]: BEBlock
        };
        textures: Texture[];
        terrainTextures: TerrainTextureFile;
        texts: {
            [language: string]: {
                [key: string]: string
            }
        }
    }

    // BehaviourPack ===============

    export type BehaviourPacks = {
        [namespace: string]: BehaviourPack;
    }

    export type BehaviourPack = {
        path?: string;
        manifest?: ManifestV2Schema;
        blocks: BlockDefinitions[];
        items: Item1[],
        entities: {
            [id: string]: EntityBehaviour;
        }
    }


}