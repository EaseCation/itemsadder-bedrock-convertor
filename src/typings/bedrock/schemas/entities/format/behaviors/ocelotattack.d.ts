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
 * Time (in seconds) between attacks.
 */
export type CooldownTime = number;
/**
 * Max distance from the target, this entity will use this attack behavior.
 */
export type MaxDistance = number;
/**
 * Max distance from the target, this entity starts sneaking.
 */
export type MaxSneakRange = number;
/**
 * Max distance from the target, this entity starts sprinting (sprinting takes priority over sneaking).
 */
export type MaxSprintRange = number;
/**
 * Used with the base size of the entity to determine minimum target-distance before trying to deal attack damage.
 */
export type ReachMultiplier = number;
/**
 * Modifies the attacking entity's movement speed while sneaking.
 */
export type SneakSpeedMultiplier = number;
/**
 * Modifies the attacking entity's movement speed while sprinting.
 */
export type SprintSpeedMultiplier = number;
/**
 * Modifies the attacking entity's movement speed when not sneaking or sprinting, but still within attack range.
 */
export type WalkSpeedMultiplier = number;
/**
 * Maximum rotation (in degrees), on the X-axis, this entity can rotate while trying to look at the target.
 */
export type XMaxRotation = number;
/**
 * Maximum rotation (in degrees), on the Y-axis, this entity can rotate its head while trying to look at the target.
 */
export type YMaxHeadRotation = number;

/**
 * Can only be used by the Ocelot. Allows it to perform the sneak and pounce attack.
 */
export interface Ocelotattack {
  priority?: Priority;
  cooldown_time?: CooldownTime;
  max_distance?: MaxDistance;
  max_sneak_range?: MaxSneakRange;
  max_sprint_range?: MaxSprintRange;
  reach_multiplier?: ReachMultiplier;
  sneak_speed_multiplier?: SneakSpeedMultiplier;
  sprint_speed_multiplier?: SprintSpeedMultiplier;
  walk_speed_multiplier?: WalkSpeedMultiplier;
  x_max_rotation?: XMaxRotation;
  y_max_head_rotation?: YMaxHeadRotation;
}
