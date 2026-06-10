// Java 方块状态键规范化 + 自定义 variant 判定
//
// 关键：Geyser(EaseCation fork) 的 MappingsReader_v1 把 state_overrides 的键拼成
//   identifier + "[" + key + "]"  然后对 JAVA_BLOCK_STATE_IDENTIFIER_TO_ID 做精确字符串匹配。
// Mojang BlockState 的字符串表示按属性名 **字母序** 排列，因此 key 必须按属性名字母序。
// IA 生成的 blockstates/*.json 里 variant 键顺序不是字母序（如
//   "attached=false,east=false,north=false,south=false,disarmed=false,west=false,powered=true"），
// 必须重排为字母序：
//   "attached=false,disarmed=false,east=false,north=false,powered=true,south=false,west=false"

/** 把 IA variant 串按属性名字母序重排，得到 Geyser state_overrides 的键 */
export function toGeyserStateKey(rawVariant: string): string {
    const pairs = rawVariant
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => {
            const eq = s.indexOf("=");
            if (eq < 0) {
                return { k: s, v: "" };
            }
            return { k: s.slice(0, eq), v: s.slice(eq + 1) };
        });
    pairs.sort((a, b) => (a.k < b.k ? -1 : a.k > b.k ? 1 : 0));
    return pairs.map(p => `${p.k}=${p.v}`).join(",");
}

/**
 * 判定 blockstate/物品 override 里的 model 引用是否指向自定义内容。
 * IA 给 vanilla 状态填的是无命名空间的 model（如 "block/tripwire_attached_n" → minecraft），
 * 自定义内容则带显式命名空间（如 "ecsb:block/swamp_plant"）。
 * @param model variant/override 的 model 字符串
 * @param namespace 可选，限定只认某个命名空间
 */
export function isCustomModel(model: string, namespace?: string): boolean {
    if (!model || !model.includes(":")) {
        return false;
    }
    const ns = model.slice(0, model.indexOf(":"));
    if (ns === "minecraft") {
        return false;
    }
    if (namespace) {
        return ns === namespace;
    }
    return true;
}

/** 从 model 引用提取命名空间，如 "ecsb:block/swamp_plant" -> "ecsb" */
export function modelNamespace(model: string): string | undefined {
    if (!model.includes(":")) {
        return undefined;
    }
    return model.slice(0, model.indexOf(":"));
}

/** 从 model 引用提取裸名，如 "ecsb:block/swamp_plant" -> "swamp_plant" */
export function modelBaseName(model: string): string {
    const afterNs = model.includes(":") ? model.slice(model.indexOf(":") + 1) : model;
    const slash = afterNs.lastIndexOf("/");
    return slash >= 0 ? afterNs.slice(slash + 1) : afterNs;
}
