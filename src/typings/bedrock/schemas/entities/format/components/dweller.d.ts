/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The type of dwelling the mob wishes to join. Current Types: village
 */
export type DwellingType = "village";
/**
 * The role of which the mob plays in the dwelling. Current Roles: inhabitant, defender, hostile, passive.
 */
export type DwellingRole = "inhabitant" | "defender" | "hostile" | "passive";
/**
 * How often the mob checks on their dwelling status in ticks. Positive values only.
 */
export type UpdateIntervalBase = number;
/**
 * The variant value in ticks that will be added to the update_interval_base.
 */
export type UpdateIntervalVariant = number;
/**
 * Whether or not the mob can find and add POI's to the dwelling.
 */
export type CanFindPoi = boolean;
/**
 * How much reputation should the players be rewarded on first founding?.
 */
export type FirstFoundingReward = number;
/**
 * Can this mob migrate between dwellings? Or does it only have its initial dwelling?.
 */
export type CanMigrate = boolean;
/**
 * A padding distance for checking if the mob is within the dwelling.
 */
export type DwellingBoundsTolerance = number;
/**
 * Allows the user to define a starting profession for this particular Dweller, instead of letting them choose organically. (They still need to gain experience from trading before this takes effect.)
 */
export type PreferredProfession = string;

/**
 * Allows a mob to join and migrate between villages and other dwellings.
 */
export interface Dweller {
  dwelling_type?: DwellingType;
  dweller_role?: DwellingRole;
  update_interval_base?: UpdateIntervalBase;
  update_interval_variant?: UpdateIntervalVariant;
  can_find_poi?: CanFindPoi;
  first_founding_reward?: FirstFoundingReward;
  can_migrate?: CanMigrate;
  dwelling_bounds_tolerance?: DwellingBoundsTolerance;
  preferred_profession?: PreferredProfession;
}
