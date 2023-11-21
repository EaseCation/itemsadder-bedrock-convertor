/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The amount of damage to deal.
 */
export type Amount = number;
/**
 * The target context to execute against.
 */
export type Target = string;
/**
 * The type of damage to deal.
 */
export type Type = string;

/**
 * Deals damage to the target.
 */
export interface Damage {
  amount?: Amount;
  target?: Target;
  type?: Type;
}