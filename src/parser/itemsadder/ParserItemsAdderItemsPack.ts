import { IPackParser } from "../IPackParser";
import fs from "fs";
import yaml from "yaml";
import { IaSchema } from "../../typings/itemsadder/schemas";
import path from "path";
import { ItemsAdderPack } from "../../typings/itemsadder/itemsadderpack";

export const ParserItemsAdderItemsPack: IPackParser<ItemsAdderPack.ItemsPacks> = {
    parse: (pathStr: string): ItemsAdderPack.ItemsPacks => {
        const result: ItemsAdderPack.ItemsPacks = {};
        const files = fs.readdirSync(pathStr);
        for (let subPath of files) {
            const fullPath = path.join(pathStr, subPath);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                const subFiles = fs.readdirSync(fullPath);
                for (let subFile of subFiles) {
                    const fullSubFilePath = path.join(fullPath, subFile);
                    const subStat = fs.statSync(fullSubFilePath);
                    if (subStat.isFile() && subFile.endsWith(".yml")) {
                        const subFileContent = fs.readFileSync(fullSubFilePath, "utf-8");
                        const iaContent = yaml.parse(subFileContent) as IaSchema;
                        if (!iaContent.info) {
                            continue;
                        }
                        const namespace = iaContent.info.namespace;
                        if (!namespace) {
                            continue;
                        }
                        if (!result[namespace]) {
                            result[namespace] = {
                                path: subPath,
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
        }
        return result;
    }
}