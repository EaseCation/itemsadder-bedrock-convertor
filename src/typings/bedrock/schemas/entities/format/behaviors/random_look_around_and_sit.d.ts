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
 * If the goal should continue to be used as long as the mob is leashed.
 */
export type ContinueIfLeashed = boolean;
/**
 * The mob will stay sitting on reload.
 */
export type ContinueSittingOnReload = boolean;
/**
 * The rightmost angle a mob can look at on the horizontal plane with respect to its initial facing direction.
 */
export type MaxAngleOfViewHorizontal = number;
/**
 * The max amount of unique looks a mob will have while looking around.
 */
export type MaxLookCount = number;
/**
 * The max amount of time (in ticks) a mob will stay looking at a direction while looking around.
 */
export type MaxLookTime = number;
/**
 * The leftmost angle a mob can look at on the horizontal plane with respect to its initial facing direction.
 */
export type MinAngleOfViewHorizontal = number;
/**
 * The min amount of unique looks a mob will have while looking around.
 */
export type MinLookCount = number;
/**
 * The min amount of time (in ticks) a mob will stay looking at a direction while looking around.
 */
export type MinLookTime = number;
/**
 * The probability of randomly looking around/sitting.
 */
export type Probability = number;
/**
 * The cooldown in seconds before the goal can be used again.
 */
export type RandomLookAroundCooldown = number;

/**
 * Allows the mob to randomly sit and look around for a duration. Note: Must have a sitting animation set up to use this.
 */
export interface RandomLookAroundAndSit {
  priority?: Priority;
  continue_if_leashed?: ContinueIfLeashed;
  continue_sitting_on_reload?: ContinueSittingOnReload;
  max_angle_of_view_horizontal?: MaxAngleOfViewHorizontal;
  max_look_count?: MaxLookCount;
  max_look_time?: MaxLookTime;
  min_angle_of_view_horizontal?: MinAngleOfViewHorizontal;
  min_look_count?: MinLookCount;
  min_look_time?: MinLookTime;
  probability?: Probability;
  random_look_around_cooldown?: RandomLookAroundCooldown;
}
