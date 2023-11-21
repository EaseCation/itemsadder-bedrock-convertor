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
 * Time in seconds the mob has to wait before using the goal again.
 */
export type CooldownTime = number;
/**
 * Distance in blocks within the mob considers it has reached the goal. This is the `wiggle room` to stop the AI from bouncing back and forth trying to reach a specific spot
 */
export type GoalRadius = number;
/**
 * The distance in blocks to search for points inside villages. If <= 0, find the closest village regardless of distance.
 */
export type SearchRange = number;
/**
 * Movement speed multiplier of the mob when using this AI Goal.
 */
export type SpeedMultiplier = number;
/**
 * This is the chance that the mob will start this goal, from 0 to 1.
 */
export type StartChance = number;

/**
 * Allows the mob to move into a random location within a village within the search range.
 */
export interface StrollTowardsVillage {
  priority?: Priority;
  cooldown_time?: CooldownTime;
  goal_radius?: GoalRadius;
  search_range?: SearchRange;
  speed_multiplier?: SpeedMultiplier;
  start_chance?: StartChance;
}
