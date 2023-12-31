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
 * Named reference of feature to be snapped.
 */
export type FeatureToSnap = string;
/**
 * Range to search for a floor or ceiling for snaping the feature.
 */
export type VerticalSearchRange = number;
/**
 * Defines the surface that the y-value of the placement position will be snapped to. Valid values: `ceiling` and `floor'
 */
export type Surface = "ceiling" | "floor";

/**
 * `minecraft:snap_to_surface_feature` snaps the y-value of a feature placement pos to the floor or the ceiling within the provided `vertical_search_range`. The placement biome is preserved.
 * If the snap position goes outside of the placement biome, placement will fail.
 */
export interface SnapToSurfaceFeature {
  description: Description;
  feature_to_snap: FeatureToSnap;
  vertical_search_range: VerticalSearchRange;
  surface?: Surface;
}
/**
 * UNDOCUMENTED.
 */
export interface Description {
  identifier: Identifier;
  [k: string]: unknown;
}
