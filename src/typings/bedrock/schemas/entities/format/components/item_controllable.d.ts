/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * List of items that can be used to control this entity.
 */
export type ControlItems = Item[] | string;
/**
 * An item that can be used to control this entity.
 */
export type Item = string;

/**
 * Efines what items can be used to control this entity while ridden.
 */
export interface ItemControllable {
  control_items?: ControlItems;
}
