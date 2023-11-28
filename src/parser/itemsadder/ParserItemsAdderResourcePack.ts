import { IPackParser } from "../IPackParser";
import fs from "fs";
import path from "path";
import { ItemsAdderPack } from "../../typings/itemsadder/itemsadderpack";
import { JavaModel } from "../../typings/itemsadder/model";
import sizeOf from 'image-size';

const getResolution = (imagePath: string) => {
    return sizeOf(imagePath);
}

const parseModels = (rootPath: string, modelsPath: string, models: ItemsAdderPack.Model[]): void => {
    const modelsFiles = fs.readdirSync(modelsPath);
    for (let model of modelsFiles) {
        const fullPath = path.join(modelsPath, model);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            parseModels(rootPath, fullPath, models);
        } else if (stat.isFile() && model.endsWith(".json")) {
            const content = JSON.parse(fs.readFileSync(fullPath, "utf-8")) as JavaModel.Model;
            if (!content.elements) {
                // 文件格式可能不是模型，跳过
                continue;
            }
            models.push({
                rootPath: rootPath,
                relativePath: path.relative(rootPath, fullPath),
                dirPath: modelsPath,
                path: fullPath,
                content: content
            });
        }
    }
}

const parseTextures = (rootPath: string, texturesPath: string, textures: ItemsAdderPack.Texture[]): void => {
    const texturesFiles = fs.readdirSync(texturesPath);
    for (let texture of texturesFiles) {
        const fullPath = path.join(texturesPath, texture);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            parseTextures(rootPath, fullPath, textures);
        } else if (stat.isFile() && (texture.endsWith(".png") || texture.endsWith(".tga"))) {
            // 获取图片的分辨率
            const resolution = getResolution(fullPath);
            if (!resolution.width || !resolution.height) {
                console.warn(`Texture ${fullPath} has no resolution, skip.`);
                continue;
            }
            let animation: ItemsAdderPack.TextureAnimation | undefined = undefined;
            // 判断同目录下是否文件名+.mcmeta的文件
            const mcmetaPath = path.join(texturesPath, texture + ".mcmeta");
            if (fs.existsSync(mcmetaPath)) {
                // 如果存在，则读取内容
                const mcmetaContent = JSON.parse(fs.readFileSync(mcmetaPath, "utf-8"));
                // 如果内容中有animation字段，则认为是动画贴图
                if (mcmetaContent.animation) {
                    animation = {
                        frametime: mcmetaContent.animation.frametime
                    }
                }
            }
            textures.push({
                rootPath: rootPath,
                relativePath: path.relative(rootPath, fullPath),
                dirPath: texturesPath,
                path: fullPath,
                resolution: {
                    width: resolution.width,
                    height: resolution.height
                },
                content: fs.readFileSync(fullPath),
                animation: animation
            });
        }
    }
}

export const ParserItemsAdderResourcePack: IPackParser<ItemsAdderPack.ResourcePacks> = {
    parse: (pathStr: string): ItemsAdderPack.ResourcePacks => {
        const result: ItemsAdderPack.ResourcePacks = {};
        const files = fs.readdirSync(pathStr);
        let assetsPath;
        if (files.indexOf("assets") === -1) {
            assetsPath = pathStr;
        } else {
            assetsPath = path.join(pathStr, "assets");
        }
        const assetsFiles = fs.readdirSync(assetsPath);
        for (let namespace of assetsFiles) {
            if (namespace.endsWith("_converted")) {
                continue;
            }
            const namespacePath = path.join(assetsPath, namespace);
            const namespaceStat = fs.statSync(namespacePath);
            if (namespaceStat.isDirectory()) {
                if (!result[namespace]) {
                    result[namespace] = {
                        path: namespacePath,
                        models: [],
                        textures: []
                    }
                }
                const namespaceFiles = fs.readdirSync(namespacePath);
                if (namespaceFiles.indexOf("models") !== -1) {
                    const modelsPath = path.join(namespacePath, "models");
                    parseModels(modelsPath, modelsPath, result[namespace].models);
                }
                if (namespaceFiles.indexOf("textures") !== -1) {
                    const texturesPath = path.join(namespacePath, "textures");
                    parseTextures(texturesPath, texturesPath, result[namespace].textures);
                }
            }
        }
        return result;
    }
}