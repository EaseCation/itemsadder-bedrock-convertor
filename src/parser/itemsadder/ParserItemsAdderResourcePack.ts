import { IPackParser } from "../IPackParser";
import fs from "fs";
import path from "path";
import { ItemsAdderPack } from "../../typings/itemsadder/itemsadderpack";
import { JavaModel } from "../../typings/itemsadder/model";

export const ParserItemsAdderResourcePack: IPackParser<ItemsAdderPack.ResourcePacks> = {
    parse: (pathStr: string): ItemsAdderPack.ResourcePacks => {
        const result: ItemsAdderPack.ResourcePacks = {};
        const files = fs.readdirSync(pathStr);
        if (files.indexOf("assets") === -1) {
            return result;
        }
        const assetsPath = path.join(pathStr, "assets");
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
                    const modelsFiles = fs.readdirSync(modelsPath);
                    for (let model of modelsFiles) {
                        if (!model.endsWith(".json")) {
                            continue;
                        }
                        result[namespace].models.push({
                            modelsPath: modelsPath,
                            path: path.join(modelsPath, model),
                            content: JSON.parse(fs.readFileSync(path.join(modelsPath, model), "utf-8")) as JavaModel.Model
                        });
                    }
                }
                if (namespaceFiles.indexOf("textures") !== -1) {
                    const texturesPath = path.join(namespacePath, "textures");
                    const texturesFiles = fs.readdirSync(texturesPath);
                    for (let texture of texturesFiles) {
                        if (!texture.endsWith(".png") && !texture.endsWith(".tga")) {
                            continue;
                        }
                        result[namespace].textures.push({
                            dirPath: texturesPath,
                            path: path.join(texturesPath, texture),
                            content: fs.readFileSync(path.join(texturesPath, texture))
                        });
                    }
                }
            }
        }
        return result;
    }
}