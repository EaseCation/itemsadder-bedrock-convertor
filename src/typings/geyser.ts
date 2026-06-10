// Geyser custom_mappings (v1) 输出格式 + 转换中间模型
// 经 EaseCation/Geyser fork 源码 MappingsReader_v1 验证：
// - blocks 的 state_overrides 键 = host标识符+"["+字母序属性串+"]" 精确匹配
// - items 用 base material + custom_model_data 匹配

// ===== 最终写盘的 custom_mappings 文件格式 =====
export interface GeyserMaterialInstance {
    texture?: string;
    render_method?: "opaque" | "alpha_test" | "blend" | "double_sided";
    face_dimming?: boolean;
    ambient_occlusion?: boolean;
}

export interface GeyserBox {
    origin: [number, number, number];
    size: [number, number, number];
}

export interface GeyserBlockStateComponents {
    geometry?: string;
    material_instances?: Record<string, GeyserMaterialInstance>;
    selection_box?: GeyserBox;
    collision_box?: GeyserBox;
    destructible_by_mining?: number;
    light_emission?: number;
    light_dampening?: number;
}

export interface GeyserBlockMapping extends GeyserBlockStateComponents {
    name: string;
    display_name?: string;
    only_override_states?: boolean;
    state_overrides?: Record<string, GeyserBlockStateComponents>;
}

export interface GeyserItemMapping {
    name: string;
    display_name?: string;
    icon: string;
    custom_model_data?: number;
    allow_offhand?: boolean;
    display_handheld?: boolean;
}

export interface GeyserMappingFile {
    format_version: number;
    items?: Record<string, GeyserItemMapping[]>;
    blocks?: Record<string, GeyserBlockMapping>;
}

// ===== 几何转换 provider（依赖注入，由 mc-model-geo 库实现）=====
export interface GeometryConvertResult {
    geometry: unknown;                 // .geo.json 内容；整方块类可为空（用内置 full_block）
    materials: Record<string, { texture: string; render_method?: string }>;
    isItemSprite?: boolean;
}
export interface GeometryConvertOptions {
    identifier: string;                // geometry.<ns>.<name>
    textureSize?: [number, number];
}
export type GeometryConvert = (javaModel: any, opts: GeometryConvertOptions) => GeometryConvertResult | undefined;

// ===== 转换中间模型（GeyserConverter 产出 → EncoderGeyser 消费）=====
export interface GeyserGeometryAsset {
    id: string;          // geometry.<ns>.<name>
    content: unknown;    // .geo.json 内容（来自 mc-model-geo）
}

export interface GeyserTextureAsset {
    key: string;         // terrain/item_texture 中的 data 键，如 ecsb_swamp_plant
    bedrockPath: string; // 包内相对路径，如 textures/blocks/swamp_plant
    content: Buffer;     // PNG 字节
    kind: "block" | "item";
}

export interface GeyserBlockEntry {
    hostBlock: string;                 // minecraft:tripwire
    name: string;                      // swamp_plant
    displayName?: string;
    stateKey: string;                  // 字母序属性串（不含 host 与括号）
    geometryId: string;                // geometry.ecsb.swamp_plant
    materialInstances: Record<string, GeyserMaterialInstance>;
    selectionBox?: GeyserBox;
    collisionBox?: GeyserBox;
    destructibleByMining?: number;     // 来自 IA hardness
    lightEmission?: number;            // 来自 IA light_level
    lightDampening?: number;           // 透明块 0
}

export interface GeyserItemEntry {
    baseMaterial: string;              // minecraft:string
    name: string;                      // swamp_plant_item
    displayName?: string;
    icon: string;                      // ecsb_swamp_plant_item
    customModelData: number;
    allowOffhand?: boolean;
}

export interface GeyserPack {
    namespace: string;
    blocks: GeyserBlockEntry[];
    items: GeyserItemEntry[];
    geometries: GeyserGeometryAsset[];
    textures: GeyserTextureAsset[];
}
