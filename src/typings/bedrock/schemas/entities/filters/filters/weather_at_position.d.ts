/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The test property.
 */
export type Test = string;
/**
 * The comparison to apply with `value`.
 */
export type Operator = "!=" | "<" | "<=" | "<>" | "=" | "==" | ">" | ">=" | "equals" | "not";
/**
 * The subject of this filter test.
 */
export type Subject = "block" | "other" | "parent" | "player" | "self" | "target" | "damager";
/**
 * The Family name to look for.
 */
export type Value = string;

/**
 * Tests the current weather, at the actor's position, against a provided weather value.
 */
export interface WeatherAtPosition {
  test?: Test;
  operator?: Operator;
  subject?: Subject;
  value: Value;
  [k: string]: unknown;
}