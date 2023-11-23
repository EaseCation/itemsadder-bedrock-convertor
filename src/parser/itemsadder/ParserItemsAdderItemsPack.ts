import { IPackParser } from "../IPackParser";
import fs from "fs";
import yaml from "yaml";
import { IaSchema } from "../../typings/itemsadder/schemas";
import path from "path";
import { ItemsAdderPack } from "../../typings/itemsadder/itemsadderpack";

const parsePath = (rootPath: string, pathStr: string, result: ItemsAdderPack.ItemsPacks): void => {
    const files = fs.readdirSync(pathStr);
    for (let subPath of files) {
        const fullPath = path.join(pathStr, subPath);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            // 递归处理子文件夹
            parsePath(rootPath, fullPath, result);
        } else if (stat.isFile() && subPath.endsWith(".yml")) {
            // 处理 .yml 文件
            const fileContent = fs.readFileSync(fullPath, "utf-8");
            const iaContent = yaml.parse(fileContent) as IaSchema;
            if (!iaContent.info) {
                continue;
            }
            const namespace = iaContent.info.namespace;
            if (!namespace) {
                continue;
            }
            if (!result[namespace]) {
                result[namespace] = {
                    path: rootPath,
                    namespace,
                    items: {},
                    entities: {}
                }
            }
            if (iaContent.items) {
                for (let itemsKey in iaContent.items) {
                    result[namespace].items[itemsKey] = { id: itemsKey, ...iaContent.items[itemsKey] };
                }
            }
            if (iaContent.entities) {
                for (let entitiesKey in iaContent.entities) {
                    result[namespace].entities[entitiesKey] = { id: entitiesKey, ...iaContent.entities[entitiesKey] };
                }
            }
        }
    }
}

export const ParserItemsAdderItemsPack: IPackParser<ItemsAdderPack.ItemsPacks> = {
    parse: (pathStr: string): ItemsAdderPack.ItemsPacks => {
        const result: ItemsAdderPack.ItemsPacks = {};
        parsePath(pathStr, pathStr, result);
        return result;
    }
}