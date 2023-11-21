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
 * Distance in blocks within the mob considers it has reached the goal. This is the `wiggle room` to stop the AI from bouncing back and forth trying to reach a specific spot
 */
export type GoalRadius = number;
/**
 * The number of blocks each tick that the mob will check within it's search range and height for a valid block to move to. A value of 0 will have the mob check every block within range in one tick
 */
export type SearchCount = number;
/**
 * Height in blocks the mob will look for land to move towards.
 */
export type SearchHeight = number;
/**
 * The distance in blocks it will look for land to move towards.
 */
export type SearchRange = number;

/**
 * Allows the mob to move back onto land when in water.
 */
export interface MoveToLand {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  goal_radius?: GoalRadius;
  search_count?: SearchCount;
  search_height?: SearchHeight;
  search_range?: SearchRange;
}