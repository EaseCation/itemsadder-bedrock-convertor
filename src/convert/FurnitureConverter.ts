import { Context, Converter } from "./Converter";
import { Item } from "../typings/itemsadder/schemas";
import { ItemsAdderPack } from "../typings/itemsadder/itemsadderpack";
import WithId = ItemsAdderPack.WithId;
import { BedrockPack } from "../typings/bedrock/bedrockpack";
import { BlockConverter } from "./BlockConverter.js";
import { MaterialInstance } from "../typings/bedrock/schemas/blocks/blocks";
import { CollisionBox, PlacementFilter1 } from "../typings/bedrock/schemas/blocks/format/minecraft.block";
import path from "path";

export const FurnitureConverter: Converter<BedrockPack.Furniture, WithId<Item>> = {

    convertToBedrock(item: WithId<Item>, context?: Context): BedrockPack.Furniture | undefined {
        if (!item.behaviours?.furniture || !context) {
            return undefined;
        }
        let block: BedrockPack.Block | undefined;
        if (context.parameters?.furniture_production) {
            block = undefined;
        } else {
            block = BlockConverter.convertToBedrock(item, context);
        }

        let entity: BedrockPack.Entity | undefined;
        // 模型 对于家具，不再设置模型，而是通过实体来展示
        if (item.resource.model_path) {
            let bedrockModel: BedrockPack.Model | undefined;
            // 寻找材质包中的模型，然后修改模型路径为models/blocks/xxx.geo.json
            for (let model of context.fullPackBedrock.resourcePack.models) {
                if (model.path === path.join("models", item.resource.model_path + ".geo.json")) {
                    model.path = path.join("models", "blocks", context.namespace + "." + path.basename(model.path));
                    bedrockModel = model;
                    // 为了防止多个namespace的模型冲突，修改模型id
                    const identifier = model.content["minecraft:geometry"][0].description.identifier;
                    const identifierSplit = identifier.split(".", 2);
                    if (identifierSplit.length === 2) {
                        model.content["minecraft:geometry"][0].description.identifier = `${identifierSplit[0]}.${context.namespace}.${identifierSplit[1]}`;
                    } else {
                        console.warn(`The model ${item.resource.model_path} has an invalid identifier: ${identifier}`);
                    }
                    break;
                }
            }
            if (bedrockModel) {
                // 判断是否需要启用entityMode
                const modelContent = bedrockModel.content["minecraft:geometry"][0];
                if (modelContent && modelContent.bones) {
                    let entityMode: boolean;
                    if (context.parameters?.furniture_force_entity) {
                        entityMode = true;
                    } else {
                        // 判断模型是否超出大小
                        const range = [[0, 0, 0], [0, 0, 0]];
                        for (let bone of modelContent.bones) {
                            if (!bone.cubes) continue;
                            for (let cube of bone.cubes) {
                                if (!cube || !cube.origin || !cube.size) continue;
                                const minX = cube.origin[0] - (cube.size[0] || 0) / 2;
                                const minY = cube.origin[1];
                                const minZ = cube.origin[2] - (cube.size[2] || 0) / 2;
                                const maxX = cube.origin[0] + (cube.size[0] || 0) / 2;
                                const maxY = cube.origin[1] + (cube.size[1] || 0);
                                const maxZ = cube.origin[2] + (cube.size[2] || 0) / 2;
                                range[0][0] = Math.min(range[0][0], minX);
                                range[0][1] = Math.min(range[0][1], minY);
                                range[0][2] = Math.min(range[0][2], minZ);
                                range[1][0] = Math.max(range[1][0], maxX);
                                range[1][1] = Math.max(range[1][1], maxY);
                                range[1][2] = Math.max(range[1][2], maxZ);
                            }
                        }
                        entityMode = range[1][0] - range[0][0] > 30 || range[1][1] - range[0][1] > 30 || range[1][2] - range[0][2] > 30;
                        if (entityMode) {
                            console.warn(`The furniture model ${item.resource.model_path} exceeds 30 blocks, registered as a custom entity.`);
                        }
                    }
                    if (entityMode) {
                        entity = {
                            resource: {
                                description: {
                                    identifier: `${context.namespace}:${item.id}`,
                                    materials: {default: "entity_alphablend"},
                                    geometry: {
                                        default: modelContent.description.identifier
                                    },
                                    textures: {
                                        default: `textures/entity/${item.resource.model_path}`
                                    },
                                    /*scripts: {
                                        animate: [
                                            `animation.${item.resource.model_path}.idle`
                                        ]
                                    },*/
                                    /*animations: {
                                        [`${item.resource.model_path}.idle`]: `animation.${item.resource.model_path}.idle`
                                    },*/
                                    render_controllers: [
                                        `controller.render.zombie`
                                    ]
                                }
                            },
                            render_controllers: {},
                            behaviour: {
                                description: {
                                    identifier: `${context.namespace}:${item.id}`,
                                    is_spawnable: true,
                                    is_summonable: true
                                },
                                components: {
                                    "minecraft:health": {
                                        value: 1,
                                        max: 1
                                    },
                                    "minecraft:physics": {
                                        has_collision: false,
                                        has_gravity: false
                                    },
                                    "minecraft:movement": {
                                        value: 0
                                    },
                                    "minecraft:knockback_resistance": {
                                        value: 1
                                    }
                                }
                            }
                        };
                    }
                }
                if (block) {
                    if (entity) {
                        // 模型过大，无法正常显示，使用实体模式
                        block.terrain["void"] = {textures: ""};
                        block.resource.textures = "void";
                    } else {
                        // 正常显示
                        block.behaviour.components["minecraft:geometry"] = modelContent.description.identifier;
                    }
                }
            }
        }

        // 找到对应的java模型
        const foundJavaModel = context.fullPackItemsAdder.resourcePack.models
            .filter(model => model.relativePath.split(".")[0] === item.resource.model_path);
        const javaModel = foundJavaModel[0];
        if (javaModel) {
            // 基于原始模型，寻找对应的材质
            const textures = context.fullPackItemsAdder.resourcePack.textures.filter(texture => {
                const texturePath = texture.relativePath.split(".")[0];
                return Object.values(javaModel.content.textures).filter(t => t.split(":").pop() === texturePath).length > 0;
            });
            for (let texture of textures) {
                const textureName = path.basename(texture.relativePath, path.extname(texture.relativePath));
                // ==== 自定义实体 ====
                if (entity) {
                    if (entity.resource.description && entity.resource.description.textures) {
                        entity.resource.description.textures['default'] = `textures/entity/${textureName}`;
                        // 添加textures
                        context.fullPackBedrock.resourcePack.textures.push({
                            dirPath: "textures/entity",
                            path: "textures/entity/" + path.basename(texture.path),
                            content: texture.content
                        });
                    }
                    if (block) {
                        // 临时方案：手持贴图
                        // 添加到terrain
                        block.terrain[textureName] = {
                            textures: "textures/entity/" + path.basename(texture.path, path.extname(texture.path))
                        };
                        block.resource.carried_textures = textureName;
                        const materialInstance: MaterialInstance = {
                            render_method: "alpha_test"
                        };
                        block.behaviour.components["minecraft:material_instances"] = {
                            "*": materialInstance
                        };
                    }
                } else {
                    // ==== 方块 ====
                    if (block) {
                        const materialInstance: MaterialInstance = {
                            texture: textureName,
                            render_method: "alpha_test"
                        };
                        if (item.resource.material?.indexOf("GLASS") !== -1) {
                            // 表示透明
                            materialInstance.render_method = "blend";
                        }
                        block.behaviour.components["minecraft:material_instances"] = {
                            "*": materialInstance
                        };
                        // 添加到terrain
                        block.terrain[textureName] = {
                            textures: "textures/blocks/" + textureName
                        };
                        // 添加textures
                        context.fullPackBedrock.resourcePack.textures.push({
                            dirPath: "textures/blocks",
                            path: "textures/blocks/" + path.basename(texture.path),
                            content: texture.content
                        });
                    }
                }
            }
            // 设置实体的scale（pc那边有1.6倍的缩放差距）
            if (entity) {
                const scale = javaModel.content.display.head?.scale;
                if (scale) {  // 理论上要求三个轴都需要一样的缩放比例
                    entity.behaviour.components["minecraft:scale"] = {
                        value: scale[0] / 1.6
                    };
                } else {
                    entity.behaviour.components["minecraft:scale"] = {
                        value: 1 / 1.6
                    }
                }
            }
        }
        // 音效
        if (block && item.behaviours.furniture.sound) {
            // sound
            if (item.behaviours.furniture.sound.break) {
                block.resource.sound = item.behaviours.furniture.sound.break.name;
            } else if (item.behaviours.furniture.sound.place) {
                block.resource.sound = item.behaviours.furniture.sound.place.name;
            }
        }
        // 发光
        if (block && item.behaviours.furniture.light_level) {
            block.behaviour.components["minecraft:light_emission"] = Math.min(15, item.behaviours.furniture.light_level);
        }
        // 碰撞箱
        if (block && item.behaviours.furniture.hitbox) {
            const box: CollisionBox = {}
            if (item.behaviours.furniture.hitbox.length_offset || item.behaviours.furniture.hitbox.width_offset || item.behaviours.furniture.hitbox.height_offset) {
                box.origin = [
                    -8 + (item.behaviours.furniture.hitbox.width_offset || 0) * 16,
                    Math.max(0, (item.behaviours.furniture.hitbox.height_offset || 0) * 16),
                    -8 + (item.behaviours.furniture.hitbox.length_offset || 0) * 16
                ];
            }
            if (item.behaviours.furniture.hitbox.length || item.behaviours.furniture.hitbox.width || item.behaviours.furniture.hitbox.height) {
                box.size = [
                    Math.max(0, Math.min(16, (item.behaviours.furniture.hitbox.width || 16) * 16)),
                    Math.max(0, Math.min(16, (item.behaviours.furniture.hitbox.height || 16) * 16)),
                    Math.max(0, Math.min(16, (item.behaviours.furniture.hitbox.length || 16) * 16)),
                ];
                if (!box.origin) {
                    box.origin = [
                        -8 + (16 - box.size[0]) / 2,
                        0,
                        -8 + (16 - box.size[2]) / 2
                    ]
                }
            }
            block.behaviour.components["minecraft:collision_box"] = box;
            block.behaviour.components["minecraft:selection_box"] = box;
        }
        // 放置条件
        if (block && item.behaviours.furniture.placeable_on) {
            const placementFilter: PlacementFilter1 = {
                allowed_faces: []
            }
            if (item.behaviours.furniture.placeable_on.ceiling) {
                placementFilter.allowed_faces?.push("down");
            }
            if (item.behaviours.furniture.placeable_on.floor) {
                placementFilter.allowed_faces?.push("up");
            }
            if (item.behaviours.furniture.placeable_on.walls) {
                placementFilter.allowed_faces?.push("side");
            }
            block.behaviour.components["minecraft:placement_filter"] = {
                conditions: [placementFilter]
            };
        }
        if (block && entity) {
            // 放置时召唤对应实体
            const eventPlace = `furniture_place_${item.id}`;
            const eventDestroy = `furniture_destroy_${item.id}`;
            block.behaviour.components["minecraft:on_placed"] = {
                event: eventPlace
            }
            block.behaviour.components["minecraft:on_player_destroyed"] = {
                event: eventDestroy
            }
            block.behaviour.events = {}
            block.behaviour.events[eventPlace] = {
                run_command: {
                    command: `summon ${context.namespace}:${item.id} ~ ~-0.5 ~`,
                }
            }
            block.behaviour.events[eventDestroy] = {
                run_command: {
                    command: `kill @e[type=${context.namespace}:${item.id},c=1,distance<1]`,
                }
            }
        }
        // solid 为false时，玩家可穿过方块
        if (block && item.behaviours.furniture.solid === false) {
            block.behaviour.components["minecraft:collision_box"] = false;
        }
        // 放置方向
        if (block && !entity) {
            //@ts-ignore
            block.behaviour.description["traits"] = {
                "minecraft:placement_direction": {
                    enabled_states: ["minecraft:cardinal_direction"]
                }
            };
            block.behaviour.permutations = [
                { // north
                    "condition": "query.block_state ('minecraft:cardinal_direction') == 'north'",
                    "components": {
                        "minecraft:transformation": {
                            "rotation": [0, 180, 0]
                        }
                    }
                },
                { // south
                    "condition": "query.block_state ('minecraft:cardinal_direction') == 'south'",
                    "components": {
                        "minecraft:transformation": {
                            "rotation": [0, 0, 0]
                        }
                    }
                },
                { // west
                    "condition": "query.block_state ('minecraft:cardinal_direction') == 'west'",
                    "components": {
                        "minecraft:transformation": {
                            "rotation": [0, -90, 0]
                        }
                    }
                },
                { // east
                    "condition": "query.block_state ('minecraft:cardinal_direction') == 'east'",
                    "components": {
                        "minecraft:transformation": {
                            "rotation": [0, 90, 0]
                        }
                    }
                }
            ]
        }
        // 可坐下
        if (entity && item.behaviours.furniture_sit) {
            const scale = entity.behaviour.components["minecraft:scale"]?.value || 1;
            entity.behaviour.components["minecraft:rideable"] = {
                seat_count: 1,
                seats: [
                    {
                        position: [0, item.behaviours.furniture_sit.sit_height / scale, 0],
                        lock_rider_rotation: 90,
                        rotate_rider_by: item.behaviours.furniture_sit?.opposite_direction ? 0 : 180
                    },
                ]
            }
        }
        // 禁止移动
        if (entity) {
            entity.behaviour.components["minecraft:is_immobile"] = { value: true }
        }

        return {block: block, entity: entity};
    },

    convertToJava(block: BedrockPack.Furniture, context?: Context): WithId<Item> | undefined {
        // TODO
        return undefined;
    }

}