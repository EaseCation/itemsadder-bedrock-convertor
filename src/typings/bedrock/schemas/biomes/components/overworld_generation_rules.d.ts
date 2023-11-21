/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type HillsTransformation = BlockReference | BlockReference1;
/**
 * UNDOCUMENTED.
 */
export type BlockReference = string;
/**
 * UNDOCUMENTED.
 *
 * @minItems 1
 */
export type BlockReference1 = [
  BlockReference2 | [] | [BiomeReference] | [BiomeReference, _],
  ...(BlockReference2 | [] | [BiomeReference] | [BiomeReference, _])[]
];
/**
 * UNDOCUMENTED.
 */
export type BlockReference2 = string;
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
export type MutateTransformation = BlockReference | BlockReference1;
/**
 * UNDOCUMENTED.
 */
export type RiverTransformation = BlockReference | BlockReference1;
/**
 * UNDOCUMENTED.
 */
export type ShoreTransformation = BlockReference | BlockReference1;
/**
 * UNDOCUMENTED.
 */
export type _1 = [] | [ClimateCategory] | [ClimateCategory, Weight];
/**
 * Name of a climate category.
 */
export type ClimateCategory = "medium" | "warm" | "lukewarm" | "cold" | "frozen";
/**
 * Weight with which this biome should be selected, relative to other biomes in the same category.
 */
export type Weight = number;
/**
 * Controls the world generation climate categories that this biome can spawn for.  A single biome can be associated with multiple categories with different weightings.
 */
export type GenerateForClimates = _1[];

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