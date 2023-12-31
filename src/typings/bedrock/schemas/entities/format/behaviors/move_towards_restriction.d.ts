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
 * UNDOCUMENTED: control flags.
 */
export type ControlFlags1 = "move" | "look";
/**
 * UNDOCUMENTED: control flags.
 */
export type ControlFlags = ControlFlags1[];

/**
 * Allows Guardians, Iron Golems and Villagers to move within their pre-defined area that the mob should be restricted to. Other mobs don't have a restriction defined.
 */
export interface MoveTowardsRestriction {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  control_flags?: ControlFlags;
}
