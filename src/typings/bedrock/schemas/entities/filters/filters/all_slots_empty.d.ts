/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Returns true when the designated equipment location for the subject entity is completely empty.
 */
export type TestProperty = string;
/**
 * (Optional) The comparison to apply with `value`.
 */
export type Operator = "!=" | "<" | "<=" | "<>" | "=" | "==" | ">" | ">=" | "equals" | "not";
/**
 * (Optional) The subject of this filter test.
 */
export type Subject = "block" | "other" | "parent" | "player" | "self" | "target" | "damager";
/**
 * The equipment location to test.
 */
export type Value = "any" | "armor" | "feet" | "hand" | "head" | "inventory" | "leg" | "torse";

/**
 * Returns true when the designated equipment location for the subject entity is completely empty.
 */
export interface AllSlotsEmpty {
  test?: TestProperty;
  operator?: Operator;
  subject?: Subject;
  value: Value;
  [k: string]: unknown;
}
