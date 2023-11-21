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
 * The distance in blocks it will look for a mob to follow.
 */
export type SearchRange = number;
/**
 * The distance in blocks this mob stops from the mob it is following.
 */
export type StopDistance = number;

/**
 * Allows the mob to follow other mobs.
 */
export interface FollowMob {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  search_range?: SearchRange;
  stop_distance?: StopDistance;
}
