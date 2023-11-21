/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * How important this behavior is. Lower priority behaviors will be executed first.
 */
export type Priority = number;
/**
 * Time in seconds the mob should wait before eating the item.
 */
export type DelayBeforeEating = number;

/**
 * If the mob is carrying a food item, the mob will eat it and the effects will be applied to the mob.
 */
export interface EatCarriedItem {
  priority?: Priority;
  delay_before_eating?: DelayBeforeEating;
}