/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The initial value of player saturation.
 */
export type Value = number;
/**
 * The maximum player saturation value.
 */
export type Maximum = number;

/**
 * Defines the player's need for food.
 */
export interface PlayerSaturation {
  value?: Value;
  max?: Maximum;
}