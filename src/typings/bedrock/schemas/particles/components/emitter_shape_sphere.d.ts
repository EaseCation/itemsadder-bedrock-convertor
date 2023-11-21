/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED: direction.
 */
export type Direction = ("inwards" | "outwards") | [] | [X] | [X, Y] | [X, Y, Z];
/**
 * UNDOCUMENTED.
 */
export type X = string | number;
/**
 * UNDOCUMENTED.
 */
export type Y = string | number;
/**
 * UNDOCUMENTED.
 */
export type Z = string | number;
/**
 * UNDOCUMENTED.
 */
export type Offset = [] | [X1] | [X1, Y1] | [X1, Y1, Z1];
/**
 * UNDOCUMENTED.
 */
export type X1 = string | number;
/**
 * UNDOCUMENTED.
 */
export type Y1 = string | number;
/**
 * UNDOCUMENTED.
 */
export type Z1 = string | number;
/**
 * UNDOCUMENTED: radius.
 */
export type Radius = string | number;
/**
 * UNDOCUMENTED: surface only.
 */
export type SurfaceOnly = boolean;

/**
 * UNDOCUMENTED.
 */
export interface EmitterShapeSphereComponentFor1100 {
  direction?: Direction;
  offset?: Offset;
  radius?: Radius;
  surface_only?: SurfaceOnly;
}