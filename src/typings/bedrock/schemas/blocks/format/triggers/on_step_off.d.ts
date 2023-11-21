/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The condition of event to be executed on the block.
 */
export type Condition = string;
/**
 * The event executed on the block.
 */
export type Event = string;
/**
 * The target of event executed on the block.
 */
export type Target = string;

/**
 * [Experimental] Describes event for this block.
 */
export interface OnStepOff {
  condition?: Condition;
  event?: Event;
  target?: Target;
  [k: string]: unknown;
}
