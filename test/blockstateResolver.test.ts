import { describe, it, expect } from "vitest";
import { toGeyserStateKey, isCustomModel, modelBaseName, modelNamespace } from "../dist/convert/geyser/blockstateResolver.js";

describe("toGeyserStateKey", () => {
    it("把 IA variant 串按属性名字母序重排（沼泽浆果真实用例）", () => {
        const raw = "attached=false,east=false,north=false,south=false,disarmed=false,west=false,powered=true";
        expect(toGeyserStateKey(raw)).toBe(
            "attached=false,disarmed=false,east=false,north=false,powered=true,south=false,west=false"
        );
    });
    it("note_block 多属性也字母序", () => {
        expect(toGeyserStateKey("powered=false,note=5,instrument=harp")).toBe(
            "instrument=harp,note=5,powered=false"
        );
    });
    it("已是字母序则不变", () => {
        expect(toGeyserStateKey("a=1,b=2")).toBe("a=1,b=2");
    });
});

describe("isCustomModel", () => {
    it("带自定义命名空间为真", () => {
        expect(isCustomModel("ecsb:block/swamp_plant")).toBe(true);
    });
    it("minecraft 命名空间为假", () => {
        expect(isCustomModel("minecraft:block/stone")).toBe(false);
    });
    it("无命名空间(vanilla 默认)为假", () => {
        expect(isCustomModel("block/tripwire_attached_n")).toBe(false);
    });
    it("可按命名空间过滤", () => {
        expect(isCustomModel("other:block/x", "ecsb")).toBe(false);
        expect(isCustomModel("ecsb:block/x", "ecsb")).toBe(true);
    });
});

describe("modelBaseName / modelNamespace", () => {
    it("提取裸名与命名空间", () => {
        expect(modelBaseName("ecsb:block/swamp_plant")).toBe("swamp_plant");
        expect(modelBaseName("ecsb:item/foo/bar")).toBe("bar");
        expect(modelNamespace("ecsb:block/swamp_plant")).toBe("ecsb");
    });
});
