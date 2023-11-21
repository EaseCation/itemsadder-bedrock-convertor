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
 * The range that the mob will search for a treasure chest within a ruin or shipwreck to move towards.
 */
export type SearchRange = number;
/**
 * The distance the mob will move before stopping.
 */
export type StopDistance = number;

/**
 * Allows the mob to move towards the nearest underwater ruin or shipwreck.
 */
export interface FindUnderwaterTreasure {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  search_range?: SearchRange;
  stop_distance?: StopDistance;
}