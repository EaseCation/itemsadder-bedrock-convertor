/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Tests for the presence of a named item in the designated slot of the subject entity.
 */
export type Test = "has_equipment";
/**
 * The equipment location to test.
 */
export type Domain = "any" | "inventory" | "armor" | "feet" | "hand" | "head" | "leg" | "torso";
/**
 * The comparison to apply with `value`.
 */
export type Operator = "!=" | "<" | "<=" | "<>" | "=" | "==" | ">" | ">=" | "equals" | "not";
/**
 * The subject of this filter test.
 */
export type Subject = "block" | "other" | "parent" | "player" | "self" | "target" | "damager";
/**
 * The item name to look for.
 */
export type Value = string;

/**
 * Tests for the presence of a named item in the designated slot of the subject entity.
 */
export interface HasEquipment {
  test?: Test;
  domain?: Domain;
  operator?: Operator;
  subject?: Subject;
  value: Value;
  [k: string]: unknown;
}
