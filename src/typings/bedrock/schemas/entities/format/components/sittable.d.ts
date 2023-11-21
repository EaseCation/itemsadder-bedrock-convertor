/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The event to fire.
 */
export type Event = string;
/**
 * The target of the event.
 */
export type Target = "baby" | "block" | "damager" | "other" | "parent" | "player" | "self" | "target";

/**
 * Defines the entity's `sit` state.
 */
export interface Sittable {
  sit_event?: SitEvent;
  stand_event?: StandEvent;
}
/**
 * Event to run when the entity enters the `sit` state.
 */
export interface SitEvent {
  event?: Event;
  target?: Target;
}
/**
 * Event to run when the entity exits the `sit` state.
 */
export interface StandEvent {
  event?: Event;
  target?: Target;
}
