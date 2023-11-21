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
        const block: BedrockPack.Block = BlockConverter.convertToBedrock(item, context)!;
        const entity: BedrockPack.Entity = {
            resource: {
                description: {
                    identifier: `${context.namespace}:${item.id}`,
                    materials: {default: "entity_alphatest"},
                    geometry: {
                        default: `geometry.${item.resource.model_path}`
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
        }
        let entityMode = false;
        // 模型 对于家具，不再设置模型，而是通过实体来展示
        if (item.resource.model_path) {
            // 寻找材质包中的模型，然后修改模型路径为models/blocks/xxx.geo.json
            for (let model of context.fullPackBedrock.resourcePack.models) {
                if (model.path.endsWith("/" + item.resource.model_path + ".geo.json")) {
                    model.path = "models/blocks/" + path.basename(model.path);
                    const modelContent = model.content["minecraft:geometry"][0];
                    if (modelContent && modelContent.bones) {
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
                        if (range[1][0] - range[0][0] > 30 || range[1][1] - range[0][1] > 30 || range[1][2] - range[0][2] > 30) {
                            console.warn(`模型 ${item.resource.model_path} 的大小超出了30格，可能会导致无法正常渲染`);
                            entityMode = true;
                        }
                    }
                    // break;
                }
            }
            if (entityMode) {
                // 模型过大，无法正常显示，使用实体模式
                block.terrain["void"] = { textures: "" }
                block.resource.textures = "void";
            } else {
                // 正常显示
                block.behaviour.components["minecraft:geometry"] = `geometry.${item.resource.model_path}`;
            }
        }
        // 音效
        if (item.behaviours.furniture.sound) {
            // sound
            if (item.behaviours.furniture.sound) {
                if (item.behaviours.furniture.sound.break) {
                    block.resource.sound = item.behaviours.furniture.sound.break.name;
                } else if (item.behaviours.furniture.sound.place) {
                    block.resource.sound = item.behaviours.furniture.sound.place.name;
                }
            }
        }
        // 寻找模型的材质
        for (let originModel of context.fullPackItemsAdder.resourcePack.models) {
            //使用path获得originModel.path的去除后缀名的文件名
            const originModelName = path.basename(originModel.path, path.extname(originModel.path));
            if (originModelName !== item.resource.model_path) {
                continue;
            }
            // 去除后缀名
            const matchingName = Object.values(originModel.content.textures)[0].split(":").pop();
            // 寻找texture
            for (let texture of context.fullPackItemsAdder.resourcePack.textures) {
                const textureFileName = path.basename(texture.path);
                const textureName = textureFileName.split(".")[0];
                if (matchingName === textureName) {
                    if (entityMode) {
                        // ==== 自定义实体 ====
                        if (entity.resource.description && entity.resource.description.textures) {
                            entity.resource.description.textures['default'] = `textures/entity/${textureName}`;
                            // 添加textures
                            context.fullPackBedrock.resourcePack.textures.push({
                                dirPath: "textures/entity",
                                path: "textures/entity/" + path.basename(texture.path),
                                content: texture.content
                            });
                        }
                    }
                    // ==== 方块 ====
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
                    if (entityMode) {
                        // 临时方案：手持贴图
                        block.resource.carried_textures = textureName;
                    }
                }
            }
        }
        // 发光
        if (item.behaviours.furniture.light_level) {
            block.behaviour.components["minecraft:light_emission"] = Math.min(15, item.behaviours.furniture.light_level);
        }
        // 碰撞箱
        if (item.behaviours.furniture.hitbox) {
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
                    Math.max(0, Math.min(16, (item.behaviours.furniture.hitbox.width || 0) * 16)),
                    Math.max(0, Math.min(16, (item.behaviours.furniture.hitbox.height || 0) * 16)),
                    Math.max(0, Math.min(16, (item.behaviours.furniture.hitbox.length || 0) * 16)),
                ];
            }
            block.behaviour.components["minecraft:collision_box"] = box;
            block.behaviour.components["minecraft:selection_box"] = box;
        }
        // 放置条件
        if (item.behaviours.furniture.placeable_on) {
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
        if (entityMode) {
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
        if (item.behaviours.furniture.solid === false) {
            block.behaviour.components["minecraft:collision_box"] = false;
        }
        return {block: block, entity: entity};
    },

    convertToJava(block: BedrockPack.Furniture, context?: Context): WithId<Item> | undefined {
        // TODO
        return undefined;
    }

}