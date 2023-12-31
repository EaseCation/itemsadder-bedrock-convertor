/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Specifies the initial rotation in degrees.
 */
export type Rotation = string | number;
/**
 * Specifies the spin rate in degrees/second.
 */
export type RotationRate = string | number;

/**
 * Starts the particle with a specified orientation and rotation rate.
 */
export interface ParticleInitialSpinComponentFor1100 {
  rotation?: Rotation;
  rotation_rate?: RotationRate;
}
