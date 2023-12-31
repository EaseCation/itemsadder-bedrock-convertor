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
 * Items that we are interested in snacking on.
 */
export type Items = Item[] | BlockceptionMinecraftItemDescriptor;
export type Item =
  | ItemIdentifier
  | ItemDescriptor
  | {
      item?: ItemIdentifier1 | ItemDescriptor1;
      [k: string]: unknown;
    };
/**
 * A minecraft item identifier.
 */
export type ItemIdentifier = string;
/**
 * [UNDOCUMENTED] A Molang expression ran against item or block to match.
 */
export type Molang = string;
/**
 * A minecraft item identifier.
 */
export type ItemIdentifier1 = string;
export type BlockceptionMinecraftItemDescriptor =
  | ItemIdentifier
  | ItemDescriptor
  | {
      item?: ItemIdentifier1 | ItemDescriptor1;
      [k: string]: unknown;
    };
/**
 * The cooldown time in seconds before the mob is able to snack again.
 */
export type SnackingCooldown = number;
/**
 * The minimum time in seconds before the mob is able to snack again.
 */
export type SnackingCooldownMinimum = number;
/**
 * This is the chance that the mob will stop snacking, from 0 to 1.
 */
export type SnackingStopChance = number;

/**
 * Allows the mob to take a load off and snack on food that it found nearby.
 */
export interface Snacking {
  priority?: Priority;
  items?: Items;
  snacking_cooldown?: SnackingCooldown;
  snacking_cooldown_min?: SnackingCooldownMinimum;
  snacking_stop_chance?: SnackingStopChance;
}
/**
 * An object that describes an item.
 */
export interface ItemDescriptor {
  tags?: Molang;
  /**
   * [UNDOCUMENTED] A tag to lookup item or block by.
   */
  item_tag?: string;
}
/**
 * An object that describes an item.
 */
export interface ItemDescriptor1 {
  tags?: Molang;
  /**
   * [UNDOCUMENTED] A tag to lookup item or block by.
   */
  item_tag?: string;
}
