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
 * A charge attack cannot start if the entity is farther than this distance to the target.
 */
export type MaxDistance = number;
/**
 * A charge attack cannot start if the entity is closer than this distance to the target.
 */
export type MinDistance = number;
/**
 * Percent chance this entity will start a charge attack, if not already attacking (1.0 = 100%)
 */
export type SuccessRate = number;

/**
 * Allows this entity to damage a target by using a running attack.
 */
export interface ChargeAttack {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  max_distance?: MaxDistance;
  min_distance?: MinDistance;
  success_rate?: SuccessRate;
}
