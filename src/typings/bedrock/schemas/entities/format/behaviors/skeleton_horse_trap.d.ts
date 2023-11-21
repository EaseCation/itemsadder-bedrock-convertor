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
 * Amount of time in seconds the trap exists. After this amount of time is elapsed, the trap is removed from the world if it hasn't been activated
 */
export type Duration = number;
/**
 * Distance in blocks that the player has to be within to trigger the horse trap.
 */
export type WithinRadius = number;

/**
 * Allows Equine mobs to be Horse Traps and be triggered like them, spawning a lightning bolt and a bunch of horses when a player is nearby. Can only be used by Horses, Mules, Donkeys and Skeleton Horses.
 */
export interface SkeletonHorseTrap {
  priority?: Priority;
  duration?: Duration;
  within_radius?: WithinRadius;
}
