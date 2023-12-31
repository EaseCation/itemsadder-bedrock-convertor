/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The chance of taming the entity with each item use between 0.0 and 1.0, where 1.0 is 100%
 */
export type Probability = number;
/**
 * The event to fire.
 */
export type Event = string;
/**
 * The target of the event.
 */
export type Target = "baby" | "block" | "damager" | "other" | "parent" | "player" | "self" | "target";
/**
 * The list of items that can be used to tame this entity.
 */
export type TameItems = ItemIdentifier[] | ItemIdentifier;
/**
 * A minecraft item identifier.
 */
export type ItemIdentifier = string;

/**
 * Defines the rules for a mob to be tamed by the player.
 */
export interface Tameable {
  probability?: Probability;
  tame_event?: TameEvent;
  tame_items?: TameItems;
}
/**
 * Event to run when this entity becomes tamed.
 */
export interface TameEvent {
  event?: Event;
  target?: Target;
}
