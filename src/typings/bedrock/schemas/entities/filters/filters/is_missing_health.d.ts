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
 * True or false.
 */
export type Value = boolean;

/**
 * Tests if the subject is not at full health.
 */
export interface InNether {
  test?: Test;
  operator?: Operator;
  subject?: Subject;
  value?: Value;
  [k: string]: unknown;
}
