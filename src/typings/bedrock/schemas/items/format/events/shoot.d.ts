/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type AngleOffset = number;
/**
 * UNDOCUMENTED.
 */
export type LaunchPower = number;
/**
 * UNDOCUMENTED.
 */
export type Projectile = string;

/**
 * UNDOCUMENTED.
 */
export interface Shoot {
  angle_offset?: AngleOffset;
  launch_power?: LaunchPower;
  projectile?: Projectile;
}