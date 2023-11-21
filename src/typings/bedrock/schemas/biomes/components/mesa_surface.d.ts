/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Controls how deep below the world water level the floor should occur.
 */
export type SeaFloorDepth = number;
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
 * Similar to overworld_surface.  Adds colored strata and optional pillars.
 */
export interface MesaSurface {
  top_material?: TopMaterial;
  mid_material?: MidMaterial;
  sea_floor_material?: SeaFloorMaterial;
  foundation_material?: FoundationMaterial;
  sea_material?: SeaMaterial;
  sea_floor_depth?: SeaFloorDepth;
  clay_material?: ClayMaterial;
  hard_clay_material?: HardClayMaterial;
  bryce_pillars?: BrycePillars;
  has_forest?: HasForest;
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
export interface FoundationMaterial {
  [k: string]: unknown;
}
/**
 * Controls the block type used for the bodies of water in this biome.
 */
export interface SeaMaterial {
  [k: string]: unknown;
}
