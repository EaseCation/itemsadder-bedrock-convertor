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
 * Allows the squid to stick to the ground when outside water. Can only be used by the Squid.
 */
export interface SquidOutOfWater {
  priority?: Priority;
}