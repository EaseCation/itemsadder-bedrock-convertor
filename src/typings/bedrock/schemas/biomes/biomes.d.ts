/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A version that tells minecraft what type of data format can be expected when reading this file.
 */
export type FormatVersion = string;
/**
 * Materials used for the surface ceiling.
 *
 * @minItems 1
 */
export type CeilingMaterials = [BlockReference, ...BlockReference[]];
/**
 * A block reference.
 */
export type BlockReference = string;
/**
 * Materials used for the surface floor.
 *
 * @minItems 1
 */
export type FloorMaterials = [BlockReference1, ...BlockReference1[]];
/**
 * A block reference.
 */
export type BlockReference1 = string;
/**
 * Material used to replace air blocks below sea level.
 */
export type SeaMaterial = string;
/**
 * Material used to repalce solid blocks that are not surface blocks.
 */
export type FoundationMaterial = string;
/**
 * Material used to decorate surface near sea level.
 */
export type BeachMaterial = string;
/**
 * UNDOCUMENTED.
 */
export type Temperature = number;
/**
 * UNDOCUMENTED.
 */
export type Downfall = number;
/**
 * UNDOCUMENTED.
 */
export type RedSpores = number;
/**
 * UNDOCUMENTED.
 */
export type BlueSpores = number;
/**
 * UNDOCUMENTED.
 */
export type Ash = number;
/**
 * UNDOCUMENTED.
 */
export type WhiteAsh = number;
/**
 * UNDOCUMENTED.
 */
export type SnowAccumulation = [] | [number] | [number, number];
/**
 * The order in which coordinates will be evaluated. Should be used when a coordinate depends on another. If omitted, defaults to `xzy`.
 */
export type CoordinateEvalOrder = "xyz" | "xzy" | "yxz" | "yzx" | "zxy" | "zyx";
/**
 * UNDOCUMENTED.
 */
export type Identifier = string;
/**
 * Number of scattered positions to generate.
 */
export type Iterations = string | number;
/**
 * UNDOCUMENTED.
 */
export type PlacesFeature = string;
export type ScatterChance =
  | {
      denominator?: Denominator;
      numerator?: Numerator;
    }
  | MolangNumber
  | number;
/**
 * UNDOCUMENTED.
 */
export type Denominator = number;
/**
 * UNDOCUMENTED.
 */
export type Numerator = number;
/**
 * Probability (0-100) that this scatter will occur.  Not evaluated each iteration; either no iterations will run, or all will.
 */
export type MolangNumber = MolangNumber1 & MolangNumber2;
export type MolangNumber1 = string | number;
export type MolangNumber2 = string;
export type X =
  | MolangNumber3
  | number
  | {
      distribution: Distribution;
      extent: Extent;
      grid_offset?: StepSize;
      step_size?: StepSize1;
    };
/**
 * Expression for the coordinate (evaluated each iteration).  Mutually exclusive with random distribution object below.
 */
export type MolangNumber3 = MolangNumber4 & MolangNumber5;
export type MolangNumber4 = string | number;
export type MolangNumber5 = string;
/**
 * Type of distribution - uniform random, gaussian (centered in the range), or grid (either fixed-step or jittered).
 */
export type Distribution = "uniform" | "gaussian" | "inverse_gaussian" | "triangle" | "fixed_grid" | "jittered_grid";
/**
 * UNDOCUMENTED.
 */
export type Extent = [] | [LowerBound] | [LowerBound, UpperBound];
/**
 * Lower bound (inclusive) of the scatter range, as an offset from the input point to scatter around.
 */
export type LowerBound = string | number;
/**
 * Upper bound (inclusive) of the scatter range, as an offset from the input point to scatter around.
 */
export type UpperBound = string | number;
/**
 * When the distribution type is grid, defines the offset along this axis.
 */
export type StepSize = number;
/**
 * When the distribution type is grid, defines the distance between steps along this axis.
 */
export type StepSize1 = number;
export type X1 =
  | MolangNumber6
  | number
  | {
      distribution: Distribution;
      extent: Extent;
      grid_offset?: StepSize;
      step_size?: StepSize1;
    };
export type MolangNumber6 = MolangNumber4 & MolangNumber5;
export type X2 =
  | MolangNumber7
  | number
  | {
      distribution: Distribution;
      extent: Extent;
      grid_offset?: StepSize;
      step_size?: StepSize1;
    };
export type MolangNumber7 = MolangNumber4 & MolangNumber5;
/**
 * UNDOCUMENTED.
 */
export type FirstPass = Iteration[];
/**
 * UNDOCUMENTED.
 */
export type FirstPass1 = Iteration[];
/**
 * UNDOCUMENTED.
 */
export type FirstPass2 = Iteration[];
/**
 * UNDOCUMENTED.
 */
export type FirstPass3 = Iteration[];
/**
 * UNDOCUMENTED.
 */
export type FirstPass4 = Iteration[];
/**
 * UNDOCUMENTED.
 */
export type FirstPass5 = Iteration[];
/**
 * UNDOCUMENTED.
 */
export type FirstPass6 = Iteration[];
/**
 * UNDOCUMENTED.
 */
export type FirstPass7 = Iteration[];
/**
 * UNDOCUMENTED.
 */
export type FirstPass8 = Iteration[];
/**
 * UNDOCUMENTED.
 */
export type FirstPass9 = Iteration[];
/**
 * UNDOCUMENTED.
 */
export type FirstPass10 = Iteration[];
/**
 * Controls how deep below the world water level the floor should occur.
 */
export type SeaFloorDepth = number;
/**
 * Controls how deep below the world water level the floor should occur.
 */
export type SeaFloorDepth1 = number;
/**
 * UNDOCUMENTED.
 */
export type ClayMaterial = string;
/**
 * UNDOCUMENTED.
 */
export type HardClayMaterial = string;
/**
 * UNDOCUMENTED.
 */
export type BrycePillars = boolean;
/**
 * UNDOCUMENTED.
 */
export type HasForest = boolean;
/**
 * UNDOCUMENTED.
 */
export type PeaksFactor = number;
/**
 * Block type use as steep material.
 */
export type Material = string;
/**
 * Enable for north facing slopes.
 */
export type NorthSlopes = boolean;
/**
 * Enable for south facing slopes.
 */
export type SouthSlopes = boolean;
/**
 * Enable for west facing slopes.
 */
export type WestSlopes = boolean;
/**
 * Enable for east facing slopes.
 */
export type EastSlopes = boolean;
/**
 * Temperature with which this biome should selected, relative to other biomes.
 */
export type TargetTemperature = number;
/**
 * Humidity with which this biome should selected, relative to other biomes.
 */
export type TargetHumidity = number;
/**
 * Altitude with which this biome should selected, relative to other biomes.
 */
export type TargetAltitude = number;
/**
 * Weirdness with which this biome should selected, relative to other biomes.
 */
export type TargetWeirdness = number;
/**
 * Weight with which this biome should selected, relative to other biomes.
 */
export type Weight = number;
/**
 * UNDOCUMENTED.
 */
export type HillsTransformation = BlockReference2 | BlockReference3;
/**
 * UNDOCUMENTED.
 */
export type BlockReference2 = string;
/**
 * UNDOCUMENTED.
 *
 * @minItems 1
 */
export type BlockReference3 = [
  BlockReference4 | [] | [BiomeReference] | [BiomeReference, _],
  ...(BlockReference4 | [] | [BiomeReference] | [BiomeReference, _])[]
];
/**
 * UNDOCUMENTED.
 */
export type BlockReference4 = string;
/**
 * UNDOCUMENTED.
 */
export type BiomeReference = string;
/**
 * UNDOCUMENTED.
 */
export type _ = number;
/**
 * UNDOCUMENTED.
 */
export type MutateTransformation = BlockReference2 | BlockReference3;
/**
 * UNDOCUMENTED.
 */
export type RiverTransformation = BlockReference2 | BlockReference3;
/**
 * UNDOCUMENTED.
 */
export type ShoreTransformation = BlockReference2 | BlockReference3;
/**
 * UNDOCUMENTED.
 */
export type _1 = [] | [ClimateCategory] | [ClimateCategory, Weight1];
/**
 * Name of a climate category.
 */
export type ClimateCategory = "medium" | "warm" | "lukewarm" | "cold" | "frozen";
/**
 * Weight with which this biome should be selected, relative to other biomes in the same category.
 */
export type Weight1 = number;
/**
 * Controls the world generation climate categories that this biome can spawn for.  A single biome can be associated with multiple categories with different weightings.
 */
export type GenerateForClimates = _1[];
/**
 * UNDOCUMENTED.
 */
export type NoiseParams = [] | [number] | [number, number];
/**
 * UNDOCUMENTED.
 */
export type NoiseType =
  | "stone_beach"
  | "deep_ocean"
  | "default"
  | "default_mutated"
  | "lowlands"
  | "river"
  | "ocean"
  | "taiga"
  | "mountains"
  | "highlands"
  | "mushroom"
  | "less_extreme"
  | "extreme"
  | "beach"
  | "swamp";
/**
 * Defines a range of noise values [min, max] for which this adjustment should be applied.
 */
export type HeightRange = [] | [Min] | [Min, Max];
/**
 * The minecraft molang definition that results in a float.
 */
export type Min = string | number;
/**
 * The minecraft molang definition that results in a float.
 */
export type Max = string | number;
/**
 * Controls the block type used for the surface of this biome when this adjustment is active.
 */
export type TopMaterial2 = string;
/**
 * Controls the block type used in a layer below the surface of this biome when this adjustment is active.
 */
export type MidMaterial2 = string;
/**
 * Controls the block type used as a floor for bodies of water in this biome when this adjustment is active.
 */
export type SeaFloorMaterial2 = string;
/**
 * Controls the block type used deep underground in this biome when this adjustment is active.
 */
export type TopMaterials = string;
/**
 * Controls the block type used in the bodies of water in this biome when this adjustment is active.
 */
export type TopMaterials1 = string;
/**
 * Defines a range of noise values [min, max] for which this adjustment should be applied.
 */
export type NoiseRange = [] | [Min1] | [Min1, Max1];
/**
 * All adjustments that match the column's noise values will be applied in the order listed.
 */
export type Adjustments = Adjustment[];
/**
 * Controls how deep below the world water level the floor should occur.
 */
export type SeaFloorDepth2 = number;
/**
 * Controls how deep below the world water level the floor should occur.
 */
export type SeaFloorDepth3 = number;

export interface MinecraftBehaviorBiomes {
  [k: string]: Biomes;
}
/**
 * The definition of a biome.
 */
export interface Biomes {
  format_version?: FormatVersion;
  "minecraft:capped_surface"?: CappedSurface;
  "minecraft:climate"?: Climate;
  "minecraft:consolidated_features"?: ConsolidatedFeatures;
  "minecraft:forced_features"?: ForcedFeatures;
  "minecraft:frozen_ocean_surface"?: FrozenOceanSurface;
  "minecraft:ignore_automatic_features"?: IgnoreAutomaticFeatures;
  "minecraft:legacy_world_generation_rules"?: LegacyWorldGenerationRules;
  "minecraft:mesa_surface"?: MesaSurface;
  "minecraft:mountain_parameters"?: MountainParameters;
  "minecraft:nether_generation_rules"?: NetherGenerationRules;
  "minecraft:nether_surface"?: NetherSurface;
  "minecraft:overworld_generation_rules"?: OverworldGenerationRules;
  "minecraft:overworld_height"?: OverworldHeight;
  "minecraft:surface_material_adjustments"?: SurfaceMaterialAdjustments;
  "minecraft:surface_parameters"?: SurfaceParameters;
  "minecraft:swamp_surface"?: SwampSurface;
  "minecraft:the_end_surface"?: EndSurface;
  [k: string]: Tag;
}
/**
 * Generates surface on blocks with non-solid blocks above or below.
 */
export interface CappedSurface {
  ceiling_materials: CeilingMaterials;
  floor_materials: FloorMaterials;
  sea_material: SeaMaterial;
  foundation_material: FoundationMaterial;
  beach_material?: BeachMaterial;
}
/**
 * Describes temperature, humidity, precipitation, etc.  Biomes without this component will have default values.
 */
export interface Climate {
  temperature?: Temperature;
  downfall?: Downfall;
  red_spores?: RedSpores;
  blue_spores?: BlueSpores;
  ash?: Ash;
  white_ash?: WhiteAsh;
  snow_accumulation?: SnowAccumulation;
}
/**
 * UNDOCUMENTED
 */
export interface ConsolidatedFeatures {}
/**
 * Force specific decorative features (trees, plants, etc.) to appear in this Biome, regardless of normal decoration rules.
 */
export interface ForcedFeatures {
  after_sky_pass?: FirstPass;
  after_surface_pass?: FirstPass1;
  after_underground_pass?: FirstPass2;
  before_sky_pass?: FirstPass3;
  before_surface_pass?: FirstPass4;
  before_underground_pass?: FirstPass5;
  final_pass?: FirstPass6;
  first_pass?: FirstPass7;
  surface_pass?: FirstPass8;
  sky_pass?: FirstPass9;
  underground_pass?: FirstPass10;
}
/**
 * UNDOCUMENTED.
 */
export interface Iteration {
  coordinate_eval_order?: CoordinateEvalOrder;
  identifier: Identifier;
  iterations: Iterations;
  places_feature: PlacesFeature;
  scatter_chance?: ScatterChance;
  x?: X;
  y?: X1;
  z?: X2;
}
/**
 * Similar to overworld_surface. Adds icebergs.
 */
export interface FrozenOceanSurface {
  top_material?: TopMaterial;
  mid_material?: MidMaterial;
  sea_floor_material?: SeaFloorMaterial;
  foundation_material?: FoundationMaterial1;
  sea_material?: SeaMaterial1;
  sea_floor_depth?: SeaFloorDepth;
}
/**
 * Controls the block type used for the surface of this biome.
 */
export interface TopMaterial {
  [k: string]: unknown;
}
/**
 * Controls the block type used in a layer below the surface of this biome.
 */
export interface MidMaterial {
  [k: string]: unknown;
}
/**
 * Controls the block type used as a floor for bodies of water in this biome.
 */
export interface SeaFloorMaterial {
  [k: string]: unknown;
}
/**
 * Controls the block type used deep underground in this biome.
 */
export interface FoundationMaterial1 {
  [k: string]: unknown;
}
/**
 * Controls the block type used for the bodies of water in this biome.
 */
export interface SeaMaterial1 {
  [k: string]: unknown;
}
/**
 * No features will be automatically attached to this Biome, only features specified in the minecraft:forced_features component will appear.
 */
export interface IgnoreAutomaticFeatures {}
/**
 * Additional world generation control applicable only to legacy limited worlds.
 */
export interface LegacyWorldGenerationRules {}
/**
 * Similar to overworld_surface.  Adds colored strata and optional pillars.
 */
export interface MesaSurface {
  top_material?: TopMaterial1;
  mid_material?: MidMaterial1;
  sea_floor_material?: SeaFloorMaterial1;
  foundation_material?: FoundationMaterial2;
  sea_material?: SeaMaterial2;
  sea_floor_depth?: SeaFloorDepth1;
  clay_material?: ClayMaterial;
  hard_clay_material?: HardClayMaterial;
  bryce_pillars?: BrycePillars;
  has_forest?: HasForest;
}
/**
 * Controls the block type used for the surface of this biome.
 */
export interface TopMaterial1 {
  [k: string]: unknown;
}
/**
 * Controls the block type used in a layer below the surface of this biome.
 */
export interface MidMaterial1 {
  [k: string]: unknown;
}
/**
 * Controls the block type used as a floor for bodies of water in this biome.
 */
export interface SeaFloorMaterial1 {
  [k: string]: unknown;
}
/**
 * Controls the block type used deep underground in this biome.
 */
export interface FoundationMaterial2 {
  [k: string]: unknown;
}
/**
 * Controls the block type used for the bodies of water in this biome.
 */
export interface SeaMaterial2 {
  [k: string]: unknown;
}
/**
 * Noise parameters used to drive mountain terrain generation in Overworld.
 */
export interface MountainParameters {
  peaks_factor?: PeaksFactor;
  steep_material_adjustment?: SteepMaterialAdjustment;
  top_slide?: TopSlide;
}
/**
 * Defines surface material for steep slopes.
 */
export interface SteepMaterialAdjustment {
  material?: Material;
  north_slopes?: NorthSlopes;
  south_slopes?: SouthSlopes;
  west_slopes?: WestSlopes;
  east_slopes?: EastSlopes;
}
/**
 * Controls the density tapering that happens at the top of the world to prevent terrain from reaching too high.
 */
export interface TopSlide {
  enabled?: Enabled;
}
/**
 * If false, top slide will be disabled. If true, other parameters will be taken into account
 */
export interface Enabled {
  [k: string]: unknown;
}
/**
 * Controls how this biome is instantiated (and then potentially modified) during world generation of the nether.
 */
export interface NetherGenerationRules {
  target_temperature?: TargetTemperature;
  target_humidity?: TargetHumidity;
  target_altitude?: TargetAltitude;
  target_weirdness?: TargetWeirdness;
  weight?: Weight;
}
/**
 * Use default Minecraft Nether terrain generation.
 */
export interface NetherSurface {}
/**
 * Control how this biome is instantiated (and then potentially modified) during world generation of the overworld.
 */
export interface OverworldGenerationRules {
  hills_transformation?: HillsTransformation;
  mutate_transformation?: MutateTransformation;
  river_transformation?: RiverTransformation;
  shore_transformation?: ShoreTransformation;
  generate_for_climates?: GenerateForClimates;
}
/**
 * Noise parameters used to drive terrain height in the Overworld.
 */
export interface OverworldHeight {
  noise_params?: NoiseParams;
  noise_type?: NoiseType;
}
/**
 * Specify fine-detail changes to blocks used in terrain generation (based on a noise function).
 */
export interface SurfaceMaterialAdjustments {
  adjustments?: Adjustments;
}
/**
 * UNDOCUMENTED.
 */
export interface Adjustment {
  height_range?: HeightRange;
  materials?: Materials;
  noise_range?: NoiseRange;
}
/**
 * UNDOCUMENTED.
 */
export interface Materials {
  top_material?: TopMaterial2;
  mid_material?: MidMaterial2;
  sea_floor_material?: SeaFloorMaterial2;
  foundation_material?: TopMaterials;
  sea_material?: TopMaterials1;
}
export interface Min1 {
  [k: string]: unknown;
}
export interface Max1 {
  [k: string]: unknown;
}
/**
 * Control the blocks used for the default Minecraft Overworld terrain generation.
 */
export interface SurfaceParameters {
  top_material?: TopMaterial3;
  mid_material?: MidMaterial3;
  sea_floor_material?: SeaFloorMaterial3;
  foundation_material?: FoundationMaterial3;
  sea_material?: SeaMaterial3;
  sea_floor_depth?: SeaFloorDepth2;
}
/**
 * Controls the block type used for the surface of this biome.
 */
export interface TopMaterial3 {
  [k: string]: unknown;
}
/**
 * Controls the block type used in a layer below the surface of this biome.
 */
export interface MidMaterial3 {
  [k: string]: unknown;
}
/**
 * Controls the block type used as a floor for bodies of water in this biome.
 */
export interface SeaFloorMaterial3 {
  [k: string]: unknown;
}
/**
 * Controls the block type used deep underground in this biome.
 */
export interface FoundationMaterial3 {
  [k: string]: unknown;
}
/**
 * Controls the block type used for the bodies of water in this biome.
 */
export interface SeaMaterial3 {
  [k: string]: unknown;
}
/**
 * Similar to overworld_surface. Adds swamp surface details.
 */
export interface SwampSurface {
  top_material?: TopMaterial4;
  mid_material?: MidMaterial4;
  sea_floor_material?: SeaFloorMaterial4;
  foundation_material?: FoundationMaterial4;
  sea_material?: SeaMaterial4;
  sea_floor_depth?: SeaFloorDepth3;
}
/**
 * Controls the block type used for the surface of this biome.
 */
export interface TopMaterial4 {
  [k: string]: unknown;
}
/**
 * Controls the block type used in a layer below the surface of this biome.
 */
export interface MidMaterial4 {
  [k: string]: unknown;
}
/**
 * Controls the block type used as a floor for bodies of water in this biome.
 */
export interface SeaFloorMaterial4 {
  [k: string]: unknown;
}
/**
 * Controls the block type used deep underground in this biome.
 */
export interface FoundationMaterial4 {
  [k: string]: unknown;
}
/**
 * Controls the block type used for the bodies of water in this biome.
 */
export interface SeaMaterial4 {
  [k: string]: unknown;
}
/**
 * Use default Minecraft End terrain generation.
 */
export interface EndSurface {}
/**
 * Components with no namespace are treated as `tags': any name consisting of alphanumeric characters, `.` and `_` is permitted; the tag is attached to the biome so that either code or data may check for its existence; tag components may not have member fields.
 */
export interface Tag {}
