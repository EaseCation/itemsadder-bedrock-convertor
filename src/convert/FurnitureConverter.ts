import { Context, Converter } from "./Converter";
import { Item } from "../typings/itemsadder/schemas";
import { ItemsAdderPack } from "../typings/itemsadder/itemsadderpack";
import WithId = ItemsAdderPack.WithId;
import { BedrockPack } from "../typings/bedrock/bedrockpack";
import { BlockConverter } from "./BlockConverter.js";
import { MaterialInstance } from "../typings/bedrock/schemas/blocks/blocks";
import { CollisionBox, PlacementFilter1 } from "../typings/bedrock/schemas/blocks/format/minecraft.block";
import path from "path";
import { PartVisibility, PartVisibility1 } from "../typings/bedrock/schemas/render_controllers/render_controllers";
import { JavaModel } from "../typings/itemsadder/model";

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
                                    textures: {},
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
                                    },
                                    "minecraft:pushable": {
                                        is_pushable: false,
                                        is_pushable_by_piston: false
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
                        // 单贴图，直接默认贴上即可
                        if (textures.length === 1) {
                            entity.resource.description.textures['default'] = `textures/entity/${textureName}`;
                            // 添加textures
                            context.fullPackBedrock.resourcePack.textures.push({
                                dirPath: "textures/entity",
                                path: "textures/entity/" + path.basename(texture.path),
                                content: texture.content
                            });
                        } else {
                            // 多贴图的情况，需要扫描原始模型，找出所有使用这个贴图的的部位，看看是否在同一个bone中
                            const textureId = Object.keys(javaModel.content.textures).find(key => {
                                const texturePath = texture.relativePath.split(".")[0];
                                return javaModel.content.textures[key].split(":").pop() === texturePath;
                            });
                            const textureIdMatch = "#" + textureId;
                            const matchedCubes: number[] = [];
                            for (let i = 0; i < javaModel.content.elements.length; i++) {
                                const element = javaModel.content.elements[i];
                                if (
                                    (!element.faces.down || element.faces.down.texture === textureIdMatch)
                                    && (!element.faces.up || element.faces.up.texture === textureIdMatch)
                                    && (!element.faces.north || element.faces.north.texture === textureIdMatch)
                                    && (!element.faces.south || element.faces.south.texture === textureIdMatch)
                                    && (!element.faces.west || element.faces.west.texture === textureIdMatch)
                                    && (!element.faces.east || element.faces.east.texture === textureIdMatch)
                                ) {
                                    matchedCubes.push(i);
                                }
                            }
                            const matchedBones: string[] = [];
                            if (matchedCubes.length > 0) {
                                if (javaModel.content.groups.find(g => typeof g === 'number') !== undefined) {
                                    // 根层存在独立的cube，发出警告
                                    console.warn(`The model ${javaModel.relativePath} has independent cubes in root level, which may cause unexpected results.`);
                                }
                                const checkGroup = (group: JavaModel.ModelGroup) => {
                                    if (group.children.every((value) => typeof value !== 'number' || matchedCubes.indexOf(value) !== -1)) {
                                        if (matchedBones.indexOf(group.name) === -1) {
                                            matchedBones.push(group.name);
                                        }
                                    }
                                    for (let child of group.children) {
                                        if (typeof child === "object") {
                                            checkGroup(child);
                                        }
                                    }
                                }
                                for (let group of javaModel.content.groups) {
                                    if (typeof group === "object") {
                                        checkGroup(group);
                                    }
                                }
                            }
                            if (matchedBones.length > 0) {
                                // console.log(`Found ${matchedBones.length} bones using texture ${textureId}(${textureName}) in model ${javaModel.relativePath}.`);
                                // console.log(matchedBones);
                                // 找到了bone，添加到render_controller中
                                entity.resource.description.textures[textureName] = `textures/entity/${textureName}`;
                                const partVisibility: PartVisibility = [
                                    { "*": 0 }
                                ];
                                for (let matchedBone of matchedBones) {
                                    const part: PartVisibility1 = {}
                                    part[matchedBone] = 1;
                                    partVisibility.push(part);
                                }
                                // 判断总帧数
                                // 获取基准贴图的宽度和高度
                                if (!javaModel.content.texture_size) {
                                    console.warn(`The model ${javaModel.relativePath} has no texture_size, skip.`);
                                    continue;
                                }
                                const baseWidth = javaModel.content.texture_size[0];
                                const baseHeight = javaModel.content.texture_size[1];
                                // 获取实际贴图的宽度和高度
                                const actualWidth = texture.resolution.width;
                                const actualHeight = texture.resolution.height;
                                const frameHeight = actualWidth * baseHeight / baseWidth;
                                let totalFrames = actualHeight / frameHeight;
                                entity.render_controllers["controller.render." + textureName] = {
                                    geometry: "Geometry.default",
                                    materials: [ { "*": texture.animation ? "Material.animation" : "Material.default" } ],
                                    textures: [ "Texture." + textureName ],
                                    part_visibility: partVisibility,
                                    uv_anim: texture.animation ? {
                                        offset: [0, `math.mod(math.floor(query.life_time * ${texture.animation.frametime}), ${totalFrames}) / ${totalFrames}`],
                                        scale: [1, `1 / ${totalFrames}`]
                                    } : undefined
                                }
                                entity.resource.description.materials!['animation'] = "player_animated";
                                // 添加textures
                                context.fullPackBedrock.resourcePack.textures.push({
                                    dirPath: "textures/entity",
                                    path: "textures/entity/" + path.basename(texture.path),
                                    content: texture.content
                                });
                            }
                        }
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
        // 实体动画控制器的应用
        if (entity && Object.keys(entity.render_controllers).length > 0) {
            // @ts-ignore
            entity.resource.description.render_controllers = Object.keys(entity.render_controllers);
        }

        return {block: block, entity: entity};
    },

    convertToJava(block: BedrockPack.Furniture, context?: Context): WithId<Item> | undefined {
        // TODO
        return undefined;
    }

}