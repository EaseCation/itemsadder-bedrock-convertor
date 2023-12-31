/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The name of this feature in the form `namespace_name:feature_name`. `feature_name` must match the filename.
 */
export type Identifier = string;
/**
 * Reference to the block to fill the cave with.
 */
export type FillWith = string;
/**
 * How many blocks to increase the cave radius by, from the center point of the cave.
 */
export type WidthModifier = string | number;
/**
 * Reference to the block to replace air blocks with.
 */
export type ReplaceAirWith = string;

/**
 * 'minecraft:underwater_cave_carver_feature' carves a cave through the world in the current chunk, and in every chunk around the current chunk in an 8 radial pattern.This feature will specifically target creating caves only below sea level.
 * This feature will also only work when placed specifically in the pass `pregeneration_pass`.
 */
export interface UnderwaterCaveCarverFeature {
  description: Description;
  fill_with?: FillWith;
  width_modifier?: WidthModifier;
  replace_air_with?: ReplaceAirWith;
}
/**
 * UNDOCUMENTED.
 */
export interface Description {
  identifier: Identifier;
  [k: string]: unknown;
}
