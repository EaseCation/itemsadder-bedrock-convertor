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
 * Amount of additional damage dealt from an elder guardian's magic attack.
 */
export type ElderExtraMagicDamage = number;
/**
 * In hard difficulty, amount of additional damage dealt from a guardian's magic attack.
 */
export type HardModeExtraMagicDamage = number;
/**
 * Amount of damage dealt from a guardian's magic attack. Magic attack damage is added to the guardian's base attack damage.
 */
export type MagicDamage = number;
/**
 * Guardian attack behavior stops if the target is closer than this distance (doesn't apply to elders).
 */
export type MinDistance = number;
/**
 * Time (in seconds) to wait after starting an attack before playing the guardian attack sound.
 */
export type SoundDelayTime = number;
/**
 * Maximum rotation (in degrees), on the X-axis, this entity can rotate while trying to look at the target.
 */
export type XMaxRotation = number;
/**
 * Maximum rotation (in degrees), on the Y-axis, this entity can rotate its head while trying to look at the target.
 */
export type YMaxHeadRotation = number;

/**
 * Allows this entity to use a laser beam attack. Can only be used by Guardians and Elder Guardians.
 */
export interface GuardianAttack {
  priority?: Priority;
  elder_extra_magic_damage?: ElderExtraMagicDamage;
  hard_mode_extra_magic_damage?: HardModeExtraMagicDamage;
  magic_damage?: MagicDamage;
  min_distance?: MinDistance;
  sound_delay_time?: SoundDelayTime;
  x_max_rotation?: XMaxRotation;
  y_max_head_rotation?: YMaxHeadRotation;
}