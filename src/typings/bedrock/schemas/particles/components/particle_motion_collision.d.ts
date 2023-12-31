/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED: collision drag.
 */
export type CollisionDrag = number;
/**
 * UNDOCUMENTED: coefficient of restitution.
 */
export type CoefficientOfRestitution = number;
/**
 * UNDOCUMENTED: collision radius.
 */
export type CollisionRadius = number;
/**
 * UNDOCUMENTED: enabled.
 */
export type Enabled = string | number;
/**
 * UNDOCUMENTED: expire on contact.
 */
export type ExpireOnContact = boolean;
/**
 * UNDOCUMENTED: event.
 */
export type Event = string;
/**
 * UNDOCUMENTED: Minimum speed.
 */
export type MinimumSpeed = number;
/**
 * UNDOCUMENTED: events.
 */
export type Events = Events1[];

/**
 * UNDOCUMENTED.
 */
export interface ParticleMotionCollisionComponentFor1100 {
  collision_drag?: CollisionDrag;
  coefficient_of_restitution?: CoefficientOfRestitution;
  collision_radius?: CollisionRadius;
  enabled?: Enabled;
  expire_on_contact?: ExpireOnContact;
  events?: Events;
}
/**
 * UNDOCUMENTED: events.
 */
export interface Events1 {
  additionalProperties?: never;
  event?: Event;
  min_speed?: MinimumSpeed;
  [k: string]: unknown;
}
