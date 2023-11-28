import { IPackEncoder } from "../IPackEncoder.js";
import { Pack } from "../../typings/pack";
import fs from "fs-extra";
import path from "path";
import { Blocks } from "../../typings/bedrock/schemas/blocks";
import { randomUUID } from "crypto";
import { ActorEntity1100 } from "../../typings/bedrock/schemas/entity/1.10.0/entity";
import {
    RenderControllers,
    RenderControllers1
} from "../../typings/bedrock/schemas/render_controllers/render_controllers";

export const EncoderBedrockResourcePack: IPackEncoder<Pack.BedrockFullPack> = {

    encode(pack: Pack.BedrockFullPack, targetPath: string): void {
        const resourcePack = pack.resourcePack;
        // 如果path已存在，则删除
        if (fs.existsSync(targetPath)) {
            fs.removeSync(targetPath);
        }
        // 创建文件夹
        fs.mkdirSync(targetPath);

        // 创建manifest.json
        if (!resourcePack.manifest) {
            console.warn("manifest.json of resource pack not found, create a new one.");
            resourcePack.manifest = {
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
                        type: "resources",
                        uuid: randomUUID(),
                        version: [1, 0, 0]
                    }
                ]
            }
        }
        fs.createFileSync(path.join(targetPath, "manifest.json"));
        fs.writeFileSync(path.join(targetPath, "manifest.json"), JSON.stringify(resourcePack.manifest, null, 2));

        if (resourcePack.textures.length > 0) {
            fs.mkdirSync(path.join(targetPath, "textures"));
            // terrain_texture.json
            fs.createFileSync(path.join(targetPath, "textures", "terrain_texture.json"));
            fs.writeFileSync(path.join(targetPath, "textures", "terrain_texture.json"), JSON.stringify(resourcePack.terrainTextures, null, 2));
            for (let texture of resourcePack.textures) {
                if (!fs.existsSync(path.join(targetPath, path.dirname(texture.path)))) {
                    fs.mkdirSync(path.join(targetPath, path.dirname(texture.path)));
                }
                fs.createFileSync(path.join(targetPath, texture.path));
                fs.writeFileSync(path.join(targetPath, texture.path), texture.content);
            }
        }

        if (resourcePack.models.length > 0) {
            fs.mkdirSync(path.join(targetPath, "models"));
            for (let model of resourcePack.models) {
                try {
                    if (!fs.existsSync(path.join(targetPath, path.dirname(model.path)))) {
                        fs.mkdirSync(path.join(targetPath, path.dirname(model.path)));
                    }
                } catch (e) {
                    console.log(model);
                    console.error(e);
                }
                fs.createFileSync(path.join(targetPath, model.path));
                fs.writeFileSync(path.join(targetPath, model.path), JSON.stringify(model.content, null, 2));
            }
        }

        if (Object.keys(resourcePack.entities).length > 0) {
            fs.mkdirSync(path.join(targetPath, "entity"));
            for (let entity in resourcePack.entities) {
                fs.createFileSync(path.join(targetPath, "entity", entity.split(":").pop() + ".entity.json"));
                const actorEntity: ActorEntity1100 = {
                    format_version: "1.10.0",
                    "minecraft:client_entity": resourcePack.entities[entity]
                }
                fs.writeFileSync(path.join(targetPath, "entity", entity.split(":").pop() + ".entity.json"), JSON.stringify(actorEntity, null, 2));
            }
        }

        if (Object.keys(resourcePack.renderControllers).length > 0) {
            fs.mkdirSync(path.join(targetPath, "render_controllers"));
            for (let key in resourcePack.renderControllers) {
                // 处理key，如果头部包含controller.render.，则去除
                let file;
                if (key.startsWith("controller.render.")) {
                    file = path.join(targetPath, "render_controllers", key.substring("controller.render.".length) + ".render_controller.json");
                } else {
                    file = path.join(targetPath, "render_controllers", key + ".render_controller.json");
                }
                fs.createFileSync(file);
                const renderControllers: RenderControllers1 = {}
                renderControllers[key] = resourcePack.renderControllers[key];
                const renderControllerFile: RenderControllers = {
                    format_version: "1.8.0",
                    render_controllers: renderControllers
                };
                fs.writeFileSync(file, JSON.stringify(renderControllerFile, null, 2));
            }
        }

        if (Object.keys(resourcePack.blocks).length > 0) {
            const blocks: Blocks = {
                ...resourcePack.blocks
            };
            blocks.format_version = "1.18.0";
            fs.createFileSync(path.join(targetPath, "blocks.json"));
            fs.writeFileSync(path.join(targetPath, "blocks.json"), JSON.stringify(blocks, null, 4));
        }

        if (Object.keys(resourcePack.texts).length > 0) {
            fs.mkdirSync(path.join(targetPath, "texts"));
            for (let language in resourcePack.texts) {
                // 将resourcePack.texts[language]一行一行写入到.lang文件中，格式为：key=value
                const lines = [];
                for (let key in resourcePack.texts[language]) {
                    lines.push(`${key}=${resourcePack.texts[language][key]}`);
                }
                fs.createFileSync(path.join(targetPath, "texts", language + ".lang"));
                fs.writeFileSync(path.join(targetPath, "texts", language + ".lang"), lines.join("\n"));
            }
        }

    }

}