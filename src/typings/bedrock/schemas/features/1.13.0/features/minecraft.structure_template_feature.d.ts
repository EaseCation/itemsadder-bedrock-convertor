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
 * Reference to the structure to be placed.
 */
export type StructureName = string;
/**
 * How far the structure is allowed to move when searching for a valid placement position. Search is radial, stopping when the nearest valid position is found. Defaults to 0 if omitted.
 */
export type AdjustmentRadius = number;
/**
 * Direction the structure will face when placed in the world. Defaults to `random` if omitted.
 */
export type FacingDirection = "north" | "south" | "east" | "west" | "random";
/**
 * A minecraft block identifier.
 */
export type Block = string;
/**
 * List of blocks the owning structure is allowed to intersect with.
 */
export type BlockAllowlist = Block[];
/**
 * A minecraft block identifier.
 */
export type Block1 = string;
/**
 * List of blocks the owning structure is allowed to intersect with.
 */
export type BlockWhitelist = Block1[];

/**
 * `minecraft:structure_template_feature` places a structure in the world. The structure must be stored as a .mcstructure file in the `structures` subdirectory of a behavior pack. It is possible to reference structures that are part of other behavior packs, they do not need to come from the same behavior pack as this feature. Constraints can be defined to specify where the structure is allowed to be placed. During placement, the feature will search for a position within the 'adjustment_radius' that satisfies all constraints. If none are found, the structure will not be placed.
 * Succeeds if: The structure is placed in the world.
 * Fails if: The structure fails to be placed within the world.
 */
export interface StructureTemplateFeature {
  description: Description;
  structure_name: StructureName;
  adjustment_radius?: AdjustmentRadius;
  facing_direction?: FacingDirection;
  /**
   * Specific constraints that must be satisfied when placing this structure.
   */
  constraints: {
    grounded?: Grounded;
    unburied?: Unburied;
    block_intersection?: Unburied1;
  };
}
/**
 * UNDOCUMENTED.
 */
export interface Description {
  identifier: Identifier;
  [k: string]: unknown;
}
/**
 * When specified, ensures the structure is on the ground.
 */
export interface Grounded {}
/**
 * When specified, ensures the structure has air above it.
 */
export interface Unburied {}
/**
 * When specified, ensures the structure has air above it.
 */
export interface Unburied1 {
  block_allowlist?: BlockAllowlist;
  block_whitelist?: BlockWhitelist;
}
