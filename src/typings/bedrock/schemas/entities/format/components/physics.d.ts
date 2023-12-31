/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Whether or not the entity collides with things.
 */
export type HasCollision = boolean;
/**
 * Whether or not the entity is affected by gravity.
 */
export type HasGravity = boolean;
/**
 * Whether or not the entity is pushed to the closest space.
 */
export type PushedTowardsClosestSpace = boolean;

/**
 * Defines the physical properties of an actor, including whether it is affected by gravity, whether it collides with objects, or whether it is pushed to the closest space.
 */
export interface Physics {
  has_collision?: HasCollision;
  has_gravity?: HasGravity;
  push_towards_closest_space?: PushedTowardsClosestSpace;
}
