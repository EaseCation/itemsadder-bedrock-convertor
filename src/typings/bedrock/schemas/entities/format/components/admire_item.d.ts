/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Duration, in seconds, for which mob won't admire items if it was hurt.
 */
export type CooldownAfterBeingAttacked = number;
/**
 * Duration, in seconds, that the mob is pacified.
 */
export type Duration = number;

/**
 * Causes the mob to ignore attackable targets for a given duration.
 */
export interface AdmireItem {
  cooldown_after_being_attacked?: CooldownAfterBeingAttacked;
  duration?: Duration;
}
