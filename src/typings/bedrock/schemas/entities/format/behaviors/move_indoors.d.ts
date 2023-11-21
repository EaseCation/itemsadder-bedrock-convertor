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
 * The cooldown time in seconds before the goal can be reused after pathfinding fails.
 */
export type TimeoutCooldown = number;

/**
 * Can only be used by Villagers. Allows them to seek shelter indoors.
 */
export interface MoveIndoors {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  timeout_cooldown?: TimeoutCooldown;
}