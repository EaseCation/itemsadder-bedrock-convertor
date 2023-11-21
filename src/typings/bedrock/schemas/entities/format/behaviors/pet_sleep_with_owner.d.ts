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
 * Distance in blocks within the mob considers it has reached the goal. This is the "wiggle room" to stop the AI from bouncing back and forth trying to reach a specific spot
 */
export type GoalRadius = number;
/**
 * Height in blocks from the owner the pet can be to sleep with owner.
 */
export type SearchHeight = number;
/**
 * The radius that the mob will search for an owner to curl up with.
 */
export type SearchRadius = number;
/**
 * The range that the mob will search for an owner to curl up with.
 */
export type SearchRange = number;

/**
 * Allows the mob to be tempted by food they like.
 */
export interface PetSleepWithOwner {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  goal_radius?: GoalRadius;
  search_height?: SearchHeight;
  search_radius?: SearchRadius;
  search_range?: SearchRange;
}
