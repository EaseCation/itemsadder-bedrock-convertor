/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Function = "enchant_randomly";
/**
 * Supports the optional treasure boolean (true/false) to allow treasure enchantments to be toggled on and off.
 */
export type Treasure = boolean;

/**
 * The function enchant_randomly.
 */
export interface EnchantRandomly {
  function?: Function;
  treasure?: Treasure;
}