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
 *  Collection of weighted features that placement will select from.
 *
 * @minItems 1
 */
export type Features = [Feature, ...Feature[]];
/**
 * Named reference to a feature.
 */
export type Feature = [] | [Feature1] | [Feature1, Weight];
/**
 * Named reference to a feature.
 */
export type Feature1 = string;
/**
 * Weight used in random selection. Value is relative to other weights in the collection.
 */
export type Weight = number;

/**
 * 'minecraft:weighted_random_feature' randomly selects and places a feature based on a weight value. Weights are relative, with higher values making selection more likely.
 * Succeeds if: The selected feature is placed.
 * Fails if: The selected feature fails to be placed.
 */
export interface WeightedRandomFeature {
  description: Description;
  features: Features;
}
/**
 * UNDOCUMENTED.
 */
export interface Description {
  identifier: Identifier;
  [k: string]: unknown;
}