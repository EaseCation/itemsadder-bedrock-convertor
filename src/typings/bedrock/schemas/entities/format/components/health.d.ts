/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The maximum starting health an entity has.
 */
export type Maximum = number;
/**
 * The amount of health an entity to start with by default.
 */
export type Value =
  | number
  | {
      range_min: RangeMinimum;
      range_max: RangeMaximum;
    };
/**
 * The minimum amount of health this mob could have.
 */
export type RangeMinimum = number;
/**
 * The maximum amount of health this mob could have.
 */
export type RangeMaximum = number;

/**
 * Specifies how much life an entity has when spawned.
 */
export interface Health {
  max?: Maximum;
  value?: Value;
}