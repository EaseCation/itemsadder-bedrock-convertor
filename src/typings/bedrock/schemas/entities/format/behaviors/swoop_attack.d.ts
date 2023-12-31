/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * How important this behavior is. Lower priority behaviors will be executed first.
 */
export type Priority = number;
/**
 * Movement speed multiplier of the mob when using this AI Goal.
 */
export type SpeedMultiplier = number;
/**
 * Added to the base size of the entity, to determine the target's maximum allowable distance, when trying to deal attack damage.
 */
export type DamageReach = number;
/**
 * Minimum and maximum cooldown time-range (in seconds) between each attempted swoop attack.
 */
export type DelayRange =
  | number
  | []
  | [A]
  | [A, B]
  | {
      range_min?: RangeMin;
      range_max?: RangeMax;
    };
/**
 * The first value of the range.
 */
export type A = number;
/**
 * The second value of the range.
 */
export type B = number;
/**
 * The minimum value of the range.
 */
export type RangeMin = number;
/**
 * The maximum value of the range.
 */
export type RangeMax = number;

/**
 * Allows the mob to move to attack a target. The goal ends if it has a horizontal collision or gets hit. Built to be used with flying mobs.
 */
export interface SwoopAttack {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  damage_reach?: DamageReach;
  delay_range?: DelayRange;
}
