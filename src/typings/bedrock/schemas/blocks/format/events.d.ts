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
export type Event1 = string;
/**
 * The target of event executed on the block.
 */
export type Target = string;

/**
 * UNDOCUMENTED.
 */
export interface Events {
  "minecraft:on_fall_on"?: Event;
  "minecraft:on_interact"?: Event;
  "minecraft:on_placed"?: Event;
  "minecraft:on_player_destroyed"?: Event;
  "minecraft:on_player_placing"?: Event;
  "minecraft:on_step_off"?: Event;
  "minecraft:on_step_on"?: Event;
  [k: string]: unknown;
}
/**
 * UNDOCUMENTED.
 */
export interface Event {
  condition?: Condition;
  event?: Event1;
  target?: Target;
}
