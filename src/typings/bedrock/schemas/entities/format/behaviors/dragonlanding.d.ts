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
 * Allows the Dragon to stop flying and transition into perching mode. Note: This behavior can only be used by the ender_dragon entity type.
 */
export interface Dragonlanding {
  priority?: Priority;
}
