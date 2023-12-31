/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Returns true when the subject entity in contact with any water: water, rain, splash water bottle.
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
 * (Optional) true or false.
 */
export type Value = boolean;

/**
 * Returns true when the subject entity in contact with any water: water, rain, splash water bottle.
 */
export interface InContactWithWater {
  test?: TestProperty;
  operator?: Operator;
  subject?: Subject;
  value?: Value;
  [k: string]: unknown;
}
