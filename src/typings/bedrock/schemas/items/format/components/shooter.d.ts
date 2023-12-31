/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Item = string;
/**
 * UNDOCUMENTED.
 */
export type UseOffhand = boolean;
/**
 * UNDOCUMENTED.
 */
export type SearchInventory = boolean;
/**
 * UNDOCUMENTED.
 */
export type UseInCreative = boolean;
/**
 * Ammunition.
 */
export type Ammunition = Ammunition1[];
/**
 * Charge on draw? Default is set to false.
 */
export type ChargeOnDraw = boolean;
/**
 * Draw Duration. Default is set to 0.
 */
export type MaximumDrawDuration = number;
/**
 * Scale power by draw duration? Default is set to false.
 */
export type ScalePowerByDrawDuration = boolean;

/**
 * Shooter Item Component.
 */
export interface Shooter {
  ammunition?: Ammunition;
  charge_on_draw?: ChargeOnDraw;
  max_draw_duration?: MaximumDrawDuration;
  scale_power_by_draw_duration?: ScalePowerByDrawDuration;
}
/**
 * UNDOCUMENTED.
 */
export interface Ammunition1 {
  item?: Item;
  use_offhand?: UseOffhand;
  search_inventory?: SearchInventory;
  use_in_creative?: UseInCreative;
}
