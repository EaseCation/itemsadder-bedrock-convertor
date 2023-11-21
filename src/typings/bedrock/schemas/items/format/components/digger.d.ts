/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Toggles if the item will be used efficiently.
 */
export type UseEfficiency = boolean;
/**
 * Speed.
 */
export type Speed = number;
/**
 * Trigger for when you dig a block that isn't listed in destroy_speeds.
 */
export type OnDig = string;
export type Block =
  | string
  | {
      any_tag?: AnyBlockTag;
    };
export type BlockTag = string;
/**
 * The block tag.
 */
export type AnyBlockTag = BlockTag[];
/**
 * Destroy speed per block.
 */
export type DestroySpeeds = DestroySpeed[];
/**
 * Trigger for when you dig a block that isn't listed in destroy_speeds.
 */
export type OnDig1 = string;

/**
 * Digger item. Component put on items that dig.
 */
export interface Digger {
  use_efficiency?: UseEfficiency;
  destroy_speeds: DestroySpeeds;
  on_dig?: OnDig1;
}
/**
 * Destroy speed per block.
 */
export interface DestroySpeed {
  speed?: Speed;
  on_dig?: OnDig;
  block?: Block;
}
