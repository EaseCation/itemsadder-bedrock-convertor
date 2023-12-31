/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The tag to check for.
 */
export type Tag = string;
/**
 * Defines the tags recipes should define to be crafted on this table. Limited to 64 tags. Each tag is limited to 64 characters.
 *
 * @maxItems 64
 */
export type CraftingTags = Tag[];
/**
 * Specifies the language file key that maps to what text will be displayed in the UI of this table. If the string given can not be resolved as a loc string, the raw string given will be displayed. If this field is omitted, the name displayed will default to the name specified in the "display_name" component. If this block has no "display_name" component, the name displayed will default to the name of the block.
 */
export type TableName = string;

/**
 * [Experimental] Makes your block into a custom crafting table which enables the crafting table UI and the ability to craft recipes.
 */
export interface CraftingTable {
  crafting_tags?: CraftingTags;
  table_name?: TableName;
}
