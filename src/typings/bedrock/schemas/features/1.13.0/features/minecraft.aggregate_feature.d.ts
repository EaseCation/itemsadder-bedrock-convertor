/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The name of this feature in the form `namespace_name:feature_name`. `feature_name` must match the filename.
 */
export type Identifier = string;
/**
 * Collection of features to be placed one by one. No guarantee of order. All features use the same input position.
 *
 * @minItems 1
 */
export type Features = [Feature, ...Feature[]];
/**
 * UNDOCUMENTED.
 */
export type Feature = string;
/**
 * LIKELY TO BE CHANGED: Do not continue placing features once either the first success or first failure has occurred.
 */
export type EarlyOut = "none" | "first_failure" | "first_success";

/**
 * 'minecraft:aggregate_feature` places a collection of features in an arbitary order. All features in the collection use the same input position. Features should not depend on each other, as there is no guarantee on the order the features will be placed.
 *  Succeeds if: At lease one feature is placed successfully.
 *  Fails if: All features fail to be placed.
 */
export interface AggregateFeature {
  description: Description;
  features: Features;
  early_out?: EarlyOut;
}
/**
 * UNDOCUMENTED.
 */
export interface Description {
  identifier: Identifier;
  [k: string]: unknown;
}
