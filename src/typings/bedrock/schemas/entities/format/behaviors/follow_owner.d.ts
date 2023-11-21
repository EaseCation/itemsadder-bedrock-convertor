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
 * Specify if the mob can teleport to the player if it is too far away.
 */
export type CanTeleport = boolean;
/**
 * Specify if the mob will follow the owner if it has heard a vibration lately.
 */
export type IgnoreVibration = boolean;
/**
 * The maximum distance in blocks this mob can be from its owner to start following, only used when canTeleport is false.
 */
export type MaxDistance = number;
/**
 * The distance in blocks that the owner can be away from this mob before it starts following it.
 */
export type StartDistance = number;
/**
 * The distance in blocks this mob will stop from its owner while following it.
 */
export type StopDistance = number;

/**
 * Allows the mob to follow the player that owns them.
 */
export interface FollowOwner {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  can_teleport?: CanTeleport;
  ignore_vibration?: IgnoreVibration;
  max_distance?: MaxDistance;
  start_distance?: StartDistance;
  stop_distance?: StopDistance;
}
