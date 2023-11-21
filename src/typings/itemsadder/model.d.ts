export declare namespace JavaModel {

    export interface Texture {
        [key: string]: string;
    }

    export interface UV {
        uv: number[];
        texture: string;
    }

    export interface Faces {
        north: UV;
        east: UV;
        south: UV;
        west: UV;
        up: UV;
        down: UV;
    }

    export interface Rotation {
        angle: number;
        axis: string;
        origin: number[];
    }

    export interface Element {
        from: number[];
        to: number[];
        rotation?: Rotation;
        faces: Faces;
    }

    export interface Display {
        rotation: number[];
        translation: number[];
        scale: number[];
    }

    export interface DisplayGroup {
        thirdperson_righthand: Display;
        thirdperson_lefthand: Display;
        firstperson_righthand: Display;
        firstperson_lefthand: Display;
        ground: Display;
        gui: Display;
        head: Display;
        fixed: Display;
    }

    export interface Model {
        credit: string;
        texture_size: number[];
        textures: Texture;
        elements: Element[];
        display: DisplayGroup;
    }

}