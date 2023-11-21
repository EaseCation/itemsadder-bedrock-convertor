/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Translate = [] | [X] | [X, Y] | [X, Y, Z];
export type X = number;
export type Y = number;
export type Z = number;
/**
 * UNDOCUMENTED.
 */
export type Scale = [] | [X] | [X, Y] | [X, Y, Z];
/**
 * UNDOCUMENTED.
 */
export type Translate1 = [] | [X] | [X, Y] | [X, Y, Z];
/**
 * UNDOCUMENTED.
 */
export type Scale1 = [] | [X] | [X, Y] | [X, Y, Z];
/**
 * UNDOCUMENTED.
 */
export type Variant = number;
/**
 * UNDOCUMENTED.
 */
export type MarkVariant = number;
/**
 * UNDOCUMENTED.
 */
export type SkinList = Skin[];

/**
 * Sets this entity as an NPC
 */
export interface Npc {
  npc_data?: NpcData;
}
/**
 * The data belonging to this npc.
 */
export interface NpcData {
  portrait_offsets?: PortraitOffsets;
  picker_offsets?: PickerOffsets;
  skin_list?: SkinList;
}
/**
 * UNDOCUMENTED.
 */
export interface PortraitOffsets {
  translate?: Translate;
  scale?: Scale;
}
/**
 * UNDOCUMENTED.
 */
export interface PickerOffsets {
  translate?: Translate1;
  scale?: Scale1;
}
/**
 * UNDOCUMENTED.
 */
export interface Skin {
  variant?: Variant;
  mark_variant?: MarkVariant;
}