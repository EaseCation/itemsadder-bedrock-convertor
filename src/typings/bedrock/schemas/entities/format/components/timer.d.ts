/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * If true, the timer will restart every time after it fires.
 */
export type Looping = boolean;
/**
 * If true, the amount of time on the timer will be random between the Minimum and Maximum values specified in time.
 */
export type RandomInterval = boolean;
/**
 * Amount of time in seconds for the timer. Can be specified as a number or a pair of numbers (Minimum and max). Incompatible with random_time_choices.
 */
export type Time = [] | [Minimum] | [Minimum, Maximum] | number;
export type Minimum = number;
export type Maximum = number;
/**
 * The event to fire.
 */
export type Event = string;
/**
 * The target of the event.
 */
export type Target = "baby" | "block" | "damager" | "other" | "parent" | "player" | "self" | "target";
/**
 * The weight on how likely this section is to trigger.
 */
export type Weight = number;
/**
 * The value in seconds that would be used if this section was picked.
 */
export type Value = number;
/**
 * This is a list of objects, representing one value in seconds that can be picked before firing the event and an optional weight. Incompatible with time.
 */
export type RandomTimeChoices = RandomTimeChoices1[];

/**
 * Adds a timer after which an event will fire.
 */
export interface Timer {
  looping?: Looping;
  randomInterval?: RandomInterval;
  time?: Time;
  time_down_event?: TimeDownEvent;
  random_time_choices?: RandomTimeChoices;
}
/**
 * Event to fire when the time on the timer runs out.
 */
export interface TimeDownEvent {
  event?: Event;
  target?: Target;
}
/**
 * representing one value in seconds that can be picked before firing the event and an optional weight. Incompatible with time.
 */
export interface RandomTimeChoices1 {
  weight?: Weight;
  value?: Value;
}
