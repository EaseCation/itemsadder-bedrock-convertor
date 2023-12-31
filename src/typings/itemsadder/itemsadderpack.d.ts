import { Entity, Item } from "./schemas";
import { JavaModel } from "./model";

declare namespace ItemsAdderPack {

    // ResourcePack ===============

    export type ResourcePacks = {
        [namespace: string]: ResourcePack;
    }

    // 不在此程序做转换，因此只记录文件名和文件内容
    export type Model = {
        rootPath: string,
        relativePath: string,
        dirPath: string,
        path: string,
        content: JavaModel.Model
    };

    export type Texture = {
        rootPath: string,
        relativePath: string,
        dirPath: string,
        path: string,
        resolution: {
            width: number,
            height: number
        }
        content: Buffer,
        animation?: TextureAnimation
    };

    export type TextureAnimation = {
        frametime: number
    }

    export type ResourcePack = {
        path?: string;
        models: Model[];
        textures: Texture[];
    }

    // ItemsPack ===============

    export type ItemsPacks = {
        [namespace: string]: ItemsPack;
    }

    export type ItemsPack = {
        path: string;
        namespace: string;
        items: {
            [id: string]: WithId<Item>;
        };
        entities: {
            [id: string]: WithId<Entity>;
        };
    }

    export type WithId<T> = { id: string } & T

}