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
 * The radius away from the target block to count as reaching the goal.
 */
export type GoalRadius = number;
/**
 * The amount of times to try finding a random outdoors position before failing.
 */
export type SearchCount = number;
/**
 * The y range to search for an outdoors position for.
 */
export type SearchHeight = number;
/**
 * The x and z range to search for an outdoors position for.
 */
export type SearchRange = number;
/**
 * The cooldown time in seconds before the goal can be reused after pathfinding fails.
 */
export type TimeoutCooldown = number;

/**
 * Forces the entity to move `outside`, whatever that means.
 */
export interface MoveOutdoors {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  goal_radius?: GoalRadius;
  search_count?: SearchCount;
  search_height?: SearchHeight;
  search_range?: SearchRange;
  timeout_cooldown?: TimeoutCooldown;
}