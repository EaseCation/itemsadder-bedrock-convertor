import { Pack } from "../typings/pack";

export interface Converter<BEDROCK, JAVA> {
    convertToJava: (value: BEDROCK, context?: Context) => JAVA | undefined;
    convertToBedrock: (value: JAVA, context?: Context) => BEDROCK | undefined;
}

export type Context = {
    namespace: string,
    readonly fullPackBedrock: Pack.BedrockFullPack,
    readonly fullPackItemsAdder: Pack.ItemsAdderFullPack,
    parameters?: Parameters
}

export type Parameters = {
    furniture_force_entity?: boolean,  // 默认false，强制将家具注册为实体，方块则只用于放置实体
    furniture_production?: boolean,  // 默认false，启用后，不注册用于放置的方块或物品
}