/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The maximum strength of this entity.
 */
export type Maximum = number;
/**
 * The initial value of the strength.
 */
export type Value = number;

/**
 * Defines the entity's strength to carry items.
 */
export interface Strength {
  max?: Maximum;
  value?: Value;
}
