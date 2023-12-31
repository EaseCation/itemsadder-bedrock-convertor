/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Item that the entity should not equip.
 */
export type ExcludedItems1 = ExcludedItems2 & ExcludedItems3;
export type ExcludedItems2 =
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
export type ExcludedItems3 = string;
/**
 * List of items that the entity should not equip.
 */
export type ExcludedItems = ExcludedItems1[];

/**
 * The entity puts on the desired equipment.
 */
export interface EquipItem {
  excluded_items?: ExcludedItems;
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
