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
 * If true, the mob will not go into water blocks when going towards a mount.
 */
export type AvoidWater = boolean;
/**
 * This is the distance the mob needs to be, in blocks, from the desired mount to mount it. If the value is below 0, the mob will use its default attack distance
 */
export type MountDistance = number;
/**
 * Time the mob will wait before starting to move towards the mount.
 */
export type StartDelay = number;
/**
 * If true, the mob will only look for a mount if it has a target.
 */
export type TargetNeeded = boolean;
/**
 * Distance in blocks within which the mob will look for a mount.
 */
export type WithinRadius = number;
/**
 * The number of failed attempts to make before this goal is no longer used.
 */
export type MaximumFailedAttempts = number;

/**
 * Allows the mob to look around for another mob to ride atop it.
 */
export interface FindMount {
  priority?: Priority;
  avoid_water?: AvoidWater;
  mount_distance?: MountDistance;
  start_delay?: StartDelay;
  target_needed?: TargetNeeded;
  within_radius?: WithinRadius;
  max_failed_attempts?: MaximumFailedAttempts;
}
