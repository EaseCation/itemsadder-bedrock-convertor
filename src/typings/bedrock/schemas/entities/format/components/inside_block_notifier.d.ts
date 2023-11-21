/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The block id, for example: `minecraft:air'.
 */
export type Name = string;
/**
 * A single state of a block.
 */
export type State = string | boolean | number;
/**
 * The event to fire.
 */
export type Event = string;
/**
 * The target of the event.
 */
export type Target = "baby" | "block" | "damager" | "other" | "parent" | "player" | "self" | "target";
/**
 * List of blocks, with certain block states, that we are monitoring to see if the entity is inside.
 */
export type BlockList = Block[];

/**
 * Verifies whether the entity is inside any of the listed blocks.
 */
export interface InsideBlockNotifier {
  block_list?: BlockList;
}
/**
 * A of block, with certain block states, that we are monitoring to see if the entity is inside.
 */
export interface Block {
  block?: Block1;
  entered_block_event?: EnteredBlockEvent;
  exited_block_event?: ExitedBlockEvent;
}
export interface Block1 {
  name?: Name;
  states?: States;
}
/**
 * The block states.
 */
export interface States {
  [k: string]: State;
}
/**
 * Event to run when this mob enters a valid block.
 */
export interface EnteredBlockEvent {
  event?: Event;
  target?: Target;
}
/**
 * Event to run when this mob leaves a valid block.
 */
export interface ExitedBlockEvent {
  event?: Event;
  target?: Target;
}
