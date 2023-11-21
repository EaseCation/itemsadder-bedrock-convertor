/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * This is the maximum number of mobs of this type spawnable on the surface.
 */
export type Surface = number;
/**
 * This is the maximum number of mobs of this type spawnable underground.
 */
export type Underground = number;

/**
 * This component allows the players to specify the amount of mobs to spawn in certain locations.
 */
export interface DensityLimit {
  surface?: Surface;
  underground?: Underground;
}