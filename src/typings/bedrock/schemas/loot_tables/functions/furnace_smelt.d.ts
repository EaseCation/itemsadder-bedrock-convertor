/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Function = "furnace_smelt";
/**
 * A minecraft loot table condition.
 */
export type Condition = {
  [k: string]: unknown;
} & {
  [k: string]: unknown;
} & {
  [k: string]: unknown;
} & {
  [k: string]: unknown;
} & {
  [k: string]: unknown;
} & {
  [k: string]: unknown;
} & {
  [k: string]: unknown;
} & {
  [k: string]: unknown;
};
/**
 * UNDOCUMENTED.
 */
export type Conditions = Condition[];

/**
 * If the item to return has a smelted crafting recipe and the loot table is triggered by an entity killed with fire. the result will be the smelted version of the item
 */
export interface FurnaceSmelt {
  function?: Function;
  conditions?: Conditions;
}
