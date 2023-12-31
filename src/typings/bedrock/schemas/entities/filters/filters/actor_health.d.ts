/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Tests the health of the subject.
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
 * (Required) A integer value.
 */
export type Value = number;

/**
 * Tests the health of the subject.
 */
export interface ActorHealth {
  test?: TestProperty;
  operator?: Operator;
  subject?: Subject;
  value: Value;
  [k: string]: unknown;
}
