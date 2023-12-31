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
 * If true, the mob will be able to use the sleep goal if riding something.
 */
export type CanSleepWhileRiding = boolean;
/**
 * Time in seconds the mob has to wait before using the goal again.
 */
export type CooldownTime = number;
/**
 * The height of the mob's collider while sleeping.
 */
export type SleepColliderHeight = number;
/**
 * The width of the mob's collider while sleeping.
 */
export type SleepColliderWidth = number;
/**
 * The y offset of the mob's collider while sleeping.
 */
export type SleepYOffset = number;
/**
 * The cooldown time in seconds before the goal can be reused after a internal failure or timeout condition.
 */
export type TimeoutCooldown = number;

/**
 * Allows mobs that own a bed to in a village to move to and sleep in it.
 */
export interface Sleep {
  priority?: Priority;
  speed_multiplier?: SpeedMultiplier;
  can_sleep_while_riding?: CanSleepWhileRiding;
  cooldown_time?: CooldownTime;
  sleep_collider_height?: SleepColliderHeight;
  sleep_collider_width?: SleepColliderWidth;
  sleep_y_offset?: SleepYOffset;
  timeout_cooldown?: TimeoutCooldown;
}
