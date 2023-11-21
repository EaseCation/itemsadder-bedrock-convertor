/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Determines if the teleport avoids putting the target in water.
 */
export type AvoidWater = boolean;
/**
 * Origin destination of the teleport.
 */
export type Destination = [] | [X] | [X, Y] | [X, Y, Z];
/**
 * The x offset from the block's center.
 */
export type X = number;
/**
 * The y offset from the block's center.
 */
export type Y = number;
/**
 * The z offset from the block's center.
 */
export type Z = number;
/**
 * Determines if the teleport places the target on a block.
 */
export type LandOnBlock = boolean;
/**
 * Maximum range the target can teleport relative to the origin destination.
 */
export type MaximumRange = [] | [X1] | [X1, Y1] | [X1, Y1, Z1];
/**
 * The x offset from the block's center.
 */
export type X1 = number;
/**
 * The y offset from the block's center.
 */
export type Y1 = number;
/**
 * The z offset from the block's center.
 */
export type Z1 = number;
/**
 * The target context to execute against.
 */
export type Target = string;

/**
 * Teleport target randomly around destination point.
 */
export interface Teleport {
  avoid_water?: AvoidWater;
  destination?: Destination;
  land_on_block?: LandOnBlock;
  max_range?: MaximumRange;
  target?: Target;
}
