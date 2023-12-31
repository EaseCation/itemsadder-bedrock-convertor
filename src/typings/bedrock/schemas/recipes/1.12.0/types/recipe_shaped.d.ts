/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type RecipeIdentifier = string;
export type Tag = string;
/**
 * Recipe tags 1.12.0
 */
export type Tags = Tag[];
/**
 * Recipe item 1.12.0
 */
export type Item =
  | ItemIdentifier
  | {
      item: ItemIdentifier1;
      data?: ItemDataValue;
      count?: Count;
    };
export type ItemIdentifier = string;
export type ItemIdentifier1 = string;
export type ItemDataValue = number;
export type Count = number;
/**
 * UNDOCUMENTED.
 */
export type Group = string;
/**
 * Characters that represent a pattern to be defined by keys.
 *
 * @minItems 1
 * @maxItems 3
 */
export type Pattern = [Pattern1] | [Pattern1, Pattern1] | [Pattern1, Pattern1, Pattern1];
export type Pattern1 = string;
/**
 * Item used as output for the furnace recipe.
 */
export type Priority = number;
/**
 * When input items match the pattern then these items are the result.
 */
export type Result = Item | Item[];

/**
 * Represents a shaped crafting recipe for a crafting table. The key used in the pattern may be any single character except the `space` character, which is reserved for empty slots in a recipe..
 */
export interface ShapedRecipe1120 {
  description: Definition;
  tags?: Tags;
  key?: Key;
  group?: Group;
  pattern?: Pattern;
  priority?: Priority;
  result?: Result;
}
/**
 * Recipe definition 1.12.0
 */
export interface Definition {
  identifier?: RecipeIdentifier;
}
/**
 * Patten key character mapped to item names.
 */
export interface Key {
  [k: string]: Item;
}
