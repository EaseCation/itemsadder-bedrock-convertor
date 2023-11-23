// Better resourcepack management #2097 https://github.com/PluginBugs/Issues-ItemsAdder/issues/2097
// 同时兼容新旧两种资源包管理方式

import { IPackParser } from "../IPackParser";
import { Pack } from "../../typings/pack";
import { ParserItemsAdderItemsPack } from "./ParserItemsAdderItemsPack.js";
import { ParserItemsAdderResourcePack } from "./ParserItemsAdderResourcePack.js";
import fs from "fs-extra";
import path from "path";

export const ParserItemsAdderFullPack: IPackParser<Pack.ItemsAdderFullPack> = {

    parse: (pathStr: string): Pack.ItemsAdderFullPack => {
        // 如果这个路径里有 items_pack和resource_pack文件夹，那么就是旧的资源包管理方式
        fs.ensureDirSync(pathStr);
        const files = fs.readdirSync(pathStr);
        if (files.indexOf("items_pack") !== -1 && files.indexOf("resource_pack") !== -1) {
            /*
            plugins/ItemsAdder/data/
            data
                 |- items_packs
                 |    |- namespace1/
                 |    |    |- .yml configurations...
                 |    |- namespace2/
                 |    |    |- .yml configurations...
                 |    |- # other namespaces perhaps...
                 |
                 |- resource_pack
                 |    |- assets/
                 |    |    |- namespace1
                 |    |    |- namespace2
                 |    |    |- # other namespaces perhaps...
                 |
             */
            const itemsPacks = ParserItemsAdderItemsPack.parse(path.join(pathStr, "items_pack"));
            const resourcePacks = ParserItemsAdderResourcePack.parse(path.join(pathStr, "resource_pack"));
            // 如果包含多个namespace，则报错提示暂不支持
            if (Object.keys(itemsPacks).length > 1) {
                throw new Error("Multiple namespaces are not supported yet.");
            }
            // 只取第一个
            return {
                namespace: Object.values(itemsPacks)[0].namespace,
                resourcePack: Object.values(resourcePacks)[0],
                itemsPack: Object.values(itemsPacks)[0],
            }
        } else if (files.indexOf("configs") !== -1 && files.indexOf("resourcepack") !== -1) {
            /*
            plugins/ItemsAdder/contents/
            contents
                 |- pack1
                 |    |- configs/
                 |    |    |- some-file.yml
                 |    |    |- some-file-2.yml
                 |    |    |- some-recipes-file.yml
                 |    |    |- ...
                 |    |
                 |    |- resourcepack/
                 |         |- namespace/
                 |         |    |- ... # The usually asset directories (textures/, models/, ...)
                 |         |- ... # other namespaces perhaps...
                 |
                 |
                 |- pack2
                 |    |- configs/
                 |    |    |- some-file.yml
                 |    |    |- some-file-2.yml
                 |    |    |- some-recipes-file.yml
                 |    |    |- ...
                 |    |
                 |    |- resourcepack/
                 |         |- namespace/
                 |         |    |- ... # The usually asset directories (textures/, models/, ...)
                 |         |- ... # other namespaces perhaps...
                 |
             */
            const itemsPacks = ParserItemsAdderItemsPack.parse(path.join(pathStr, "configs"));
            const resourcePacks = ParserItemsAdderResourcePack.parse(path.join(pathStr, "resourcepack"));
            // 如果包含多个namespace，则报错提示暂不支持
            if (Object.keys(itemsPacks).length > 1) {
                throw new Error("Multiple namespaces are not supported yet.");
            }
            // 只取第一个
            return {
                namespace: Object.values(itemsPacks)[0].namespace,
                resourcePack: Object.values(resourcePacks)[0],
                itemsPack: Object.values(itemsPacks)[0],
            }
        }

        throw new Error("Unknown ItemsAdder pack format.");
    }

}