/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The maximum number in degrees the mob can turn per tick.
 */
export type MaximumTurn = number;
/**
 * UNDOCUMENTED.
 */
export type StartSpeed = number;
/**
 * UNDOCUMENTED.
 */
export type SpeedWhenTurning = number;

/**
 * This is the move control for a flying mob that has a gliding movement.
 */
export interface MovementGlide {
  max_turn?: MaximumTurn;
  start_speed?: StartSpeed;
  speed_when_turning?: SpeedWhenTurning;
}