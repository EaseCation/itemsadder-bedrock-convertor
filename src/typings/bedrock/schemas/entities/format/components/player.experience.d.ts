/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The initial value of the player experience.
 */
export type Value = number;
/**
 * The maximum player experience of this entity.
 */
export type Maximum = number;

/**
 * Defines how much experience each player action should take.
 */
export interface PlayerExperience {
  value?: Value;
  max?: Maximum;
}
