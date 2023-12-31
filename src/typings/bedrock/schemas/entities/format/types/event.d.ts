/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Minecraft behavior event.
 */
export type Event =
  | string
  | {
      event?: Event1;
      target?: Target;
      [k: string]: unknown;
    };
/**
 * The event to fire.
 */
export type Event1 = string;
/**
 * The target of the event.
 */
export type Target = "baby" | "block" | "damager" | "other" | "parent" | "player" | "self" | "target";
