/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * This is the priority of the mob spawning out of 100.
 */
export type Default = number;
/**
 * UNDOCUMENTED.
 */
export type Rarity = number;

/**
 * This component allows players to set a priority for how often that mob should spawn. Mobs with lower weight values will have a lower chance to spawn than mobs with higher weight values.
 */
export interface Weight {
  default?: Default;
  rarity?: Rarity;
}
