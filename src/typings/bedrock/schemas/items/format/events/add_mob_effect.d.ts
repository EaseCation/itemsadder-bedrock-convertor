/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Effect = string;
/**
 * UNDOCUMENTED.
 */
export type Target = "holder";
/**
 * UNDOCUMENTED.
 */
export type Duration = number;
/**
 * UNDOCUMENTED.
 */
export type Amplifier = number;

/**
 * UNDOCUMENTED.
 */
export interface AddMobEffect {
  effect?: Effect;
  target?: Target;
  duration?: Duration;
  amplifier?: Amplifier;
}
