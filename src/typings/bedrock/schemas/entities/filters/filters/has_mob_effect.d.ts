/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Tests whether the Subject has the specified mob effect.
 */
export type TestProperty = string;
/**
 * The comparison to apply with `value`.
 */
export type Operator = "!=" | "<" | "<=" | "<>" | "=" | "==" | ">" | ">=" | "equals" | "not";
/**
 * The subject of this filter test.
 */
export type Subject = "block" | "other" | "parent" | "player" | "self" | "target" | "damager";
/**
 * The specified mob effect.
 */
export type Value = string;

/**
 * Tests whether the Subject has the specified mob effect.
 */
export interface HasMobEffect {
  test?: TestProperty;
  operator?: Operator;
  subject?: Subject;
  value: Value;
  [k: string]: unknown;
}