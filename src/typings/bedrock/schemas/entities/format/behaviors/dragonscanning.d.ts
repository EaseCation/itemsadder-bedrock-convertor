/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * How important this behavior is. Lower priority behaviors will be executed first.
 */
export type Priority = number;

/**
 * Allows an entity to look around for a player to attack while in perch mode. Note: This behavior can only be used by the ender_dragon entity type.
 */
export interface Dragonscanning {
  priority?: Priority;
}
