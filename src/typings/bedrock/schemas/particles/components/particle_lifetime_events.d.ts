/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Fires when the particle is created.
 */
export type CreationEvent = string[] | string;
/**
 * Fires when the particle expires (does not wait for particles to expire too).
 */
export type ExpirationEvent = string[] | string;

/**
 * UNDOCUMENTED.
 */
export interface ParticleLifetimeEventsComponentFor1100 {
  creation_event?: CreationEvent;
  custom_events?: CustomEvents;
  expiration_event?: ExpirationEvent;
  timeline?: Timeline;
}
/**
 * UNDOCUMENTED, unclear structure :(.
 */
export interface CustomEvents {
  [k: string]: unknown;
}
/**
 * UNDOCUMENTED: timeline.
 */
export interface Timeline {
  [k: string]: unknown;
}
