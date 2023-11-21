import { BedrockPack } from "./bedrock/bedrockpack";
import { ItemsAdderPack } from "./itemsadder/itemsadderpack";

declare namespace Pack {

    export type BedrockFullPack = {
        namespace: string;
        resourcePack: BedrockPack.ResourcePack;
        behaviourPack: BedrockPack.BehaviourPack;
    }

    export type ItemsAdderFullPack = {
        namespace: string;
        resourcePack: ItemsAdderPack.ResourcePack;
        itemsPack: ItemsAdderPack.ItemsPack;
    }

}