/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Function = "enchant_with_levels";
/**
 * UNDOCUMENTED.
 */
export type Levels =
  | number
  | {
      min: Minimum;
      max: Maximum;
    };
export type Minimum = number;
export type Maximum = number;
/**
 * UNDOCUMENTED.
 */
export type Treasure = boolean;

/**
 * The function enchant_with_levels.
 */
export interface EnchantWithLevels {
  function?: Function;
  levels?: Levels;
  treasure?: Treasure;
}
