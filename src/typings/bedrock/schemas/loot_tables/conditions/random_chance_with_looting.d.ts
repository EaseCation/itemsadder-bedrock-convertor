/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Condition = string;
/**
 * The random chance of the value.
 */
export type Chance = number;
/**
 * The multiplier for the chance if the target entity has the looting enchant that affects the actor.
 */
export type LootingMultiplier = number;

/**
 * Sets a random chance of the specified value. Looting enchantment increase the random chance multiplier.
 */
export interface RandomChanceWithLooting {
  condition?: Condition;
  chance?: Chance;
  looting_multiplier?: LootingMultiplier;
}
