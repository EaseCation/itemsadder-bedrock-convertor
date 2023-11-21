import { Pack } from "../typings/pack";

export interface Converter<BEDROCK, JAVA> {
    convertToJava: (value: BEDROCK, context?: Context) => JAVA | undefined;
    convertToBedrock: (value: JAVA, context?: Context) => BEDROCK | undefined;
}

export type Context = {
    namespace: string,
    readonly fullPackBedrock: Pack.BedrockFullPack,
    readonly fullPackItemsAdder: Pack.ItemsAdderFullPack,
}