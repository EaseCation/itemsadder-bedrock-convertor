/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

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
