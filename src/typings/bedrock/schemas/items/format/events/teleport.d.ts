/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Target = "holder";
/**
 * UNDOCUMENTED.
 */
export type MaximumRange = [] | [X] | [X, Y] | [X, Y, Z];
/**
 * UNDOCUMENTED.
 */
export type X = number;
/**
 * UNDOCUMENTED.
 */
export type Y = number;
/**
 * UNDOCUMENTED.
 */
export type Z = number;

/**
 * UNDOCUMENTED.
 */
export interface Teleport {
  target?: Target;
  max_range?: MaximumRange;
}
