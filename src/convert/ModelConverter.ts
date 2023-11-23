import { Converter } from "./Converter";
import path from "path";
import fs from "fs";
import { Geometry1160, Model } from "../typings/bedrock/schemas/models/entity/1.16.0/model_entity";
import { ItemsAdderPack } from "../typings/itemsadder/itemsadderpack";
import { BedrockPack } from "../typings/bedrock/bedrockpack";

const checkConvertExists = (rootPath: string): string | undefined => {
    // 获取modelsPath的父级目录
    // 获取父级目录的父级目录
    const grandParentDir = path.dirname(rootPath);
    // 获取原文件名
    const originalName = path.basename(grandParentDir);
    // 构造新的文件名
    const newFileName = `${originalName}_converted`;
    // 构造新的文件路径
    const newFilePath = path.join(path.dirname(grandParentDir), newFileName, "models");
    // 检查文件是否存在
    if (fs.existsSync(newFilePath)) {
        return newFilePath;
    } else {
        return undefined;
    }
};

export const ModelConverter: Converter<BedrockPack.Model, ItemsAdderPack.Model> = {

    convertToJava: (model): ItemsAdderPack.Model | undefined => {
        return undefined;
    },

    convertToBedrock: (model): BedrockPack.Model | undefined => {
        const convertPath = checkConvertExists(model.rootPath);
        if (!convertPath) {
            console.warn(`Can't find converted model file of ${model.relativePath}`);
            return undefined;
        }
        // 得到相对路径
        const relativePath = model.relativePath;
        let targetPath = path.join(convertPath, relativePath);
        // 如果targetPath不存在
        if (!fs.existsSync(targetPath)) {
            targetPath = targetPath.replace(".json", ".geo.json");
        }
        // 从targetPath取文件名
        const fileName = path.basename(targetPath);
        // 读取targetPath为json
        const content = JSON.parse(fs.readFileSync(targetPath, "utf-8")) as Geometry1160;

        return {
            path: "models/" + relativePath.replace(".json", ".geo.json"),
            content: content
        }
    }

};