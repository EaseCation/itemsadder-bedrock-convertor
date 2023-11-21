/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A version that tells minecraft what type of data format can be expected when reading this file.
 */
export type FormatVersion = string;
/**
 * The item identifier.
 */
export type Identifier = string;
/**
 * The category this item belongs in.
 */
export type Category = string;
/**
 * The texture defined in `textures/item_texture.json`
 */
export type Icon = string;
/**
 * The render offset used for the item.
 */
export type RenderOffsets = "apple";

/**
 * Minecraft items 1.10.0
 */
export interface Item {
  format_version: FormatVersion;
  "minecraft:item": Item1;
  [k: string]: unknown;
}
/**
 * A resource pack definition of an item.
 */
export interface Item1 {
  description: Description;
  components: Components;
}
/**
 * The description of an item.
 */
export interface Description {
  identifier: Identifier;
  category?: Category;
}
/**
 * The components that describe this item.
 */
export interface Components {
  "minecraft:icon"?: Icon;
  "minecraft:render_offsets"?: RenderOffsets;
}
