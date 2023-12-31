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
 * If true, the mob will avoid surface water blocks by swimming below them.
 */
export type AvoidSurface = boolean;
/**
 * A random value to determine when to randomly move somewhere. This has a 1/interval chance to choose this goal
 */
export type Interval = number;
/**
 * Distance in blocks on ground that the mob will look for a new spot to move to. Must be at least 1
 */
export type XZDistance = number;
/**
 * Distance in blocks that the mob will look up or down for a new spot to move to. Must be at least 1
 */
export type YDistance = number;

/**
 * Allows an entity to randomly move through water.
 */
export interface RandomSwim {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  avoid_surface?: AvoidSurface;
  interval?: Interval;
  xz_dist?: XZDistance;
  y_dist?: YDistance;
}
