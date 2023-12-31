/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The name of the sound to play.
 */
export type Sound = string;
/**
 * The target context to execute against.
 */
export type Target = string;

/**
 * Play a sound relative to target position.
 */
export interface Playsound {
  sound?: Sound;
  target?: Target;
}
