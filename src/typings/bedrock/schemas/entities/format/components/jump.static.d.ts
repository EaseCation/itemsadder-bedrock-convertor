/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The initial vertical velocity for the jump.
 */
export type JumpPower = number;

/**
 * Gives the entity the ability to jump.
 */
export interface JumpStatic {
  jump_power?: JumpPower;
}
