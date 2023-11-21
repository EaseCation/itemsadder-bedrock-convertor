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
 * Reference to the block to be placed.
 */
export type PlacesBlock = string;
/**
 * If true, enforce the block's canPlace check.
 */
export type EnforcePlacementRules = boolean;
/**
 * If true, enforce the block's canSurvive check.
 */
export type EnforceSurvivabilityRules = boolean;
/**
 * UNDOCUMENTED.
 */
export type Top = string | BlockSide[];
/**
 * UNDOCUMENTED.
 */
export type BlockSide = string;
/**
 * UNDOCUMENTED.
 */
export type Bottom = string | BlockSide[];
/**
 * UNDOCUMENTED.
 */
export type North = string | BlockSide[];
/**
 * UNDOCUMENTED.
 */
export type South = string | BlockSide[];
/**
 * UNDOCUMENTED.
 */
export type East = string | BlockSide[];
/**
 * UNDOCUMENTED.
 */
export type West = string | BlockSide[];
/**
 * UNDOCUMENTED.
 */
export type All = string | BlockSide[];
/**
 * UNDOCUMENTED.
 */
export type Sides = string | BlockSide[];
/**
 * A block that may be replaced during placement. Omit this field to allow any block to be replaced.
 */
export type Block = string;
/**
 * A list of blocks that may be replaced during placement. Omit this field to allow any block to be replaced.
 */
export type MayReplace = Block[];

/**
 * `minecraft:single_block_feature` places a single block in the world. The `may_place_on` and `may_replace` fields are allowlists which specify where the block can be placed. If these fields are omitted, the block can be placed anywhere. The block's internal survivability and placement rules can optionally be enforced with the `enforce_survivability_rules` and `enforce_placement_rules` fields. These rules are specified per-block and are typically designed to produce high quality gameplay or natural behavior. However, enabling this enforcement may make it harder to debug placement failures.
 *  Succeeds if: The block is successfully placed in the world.
 *  Fails if: The block fails to be placed.
 */
export interface SingleBlockFeature {
  description: Description;
  places_block: PlacesBlock;
  enforce_placement_rules: EnforcePlacementRules;
  enforce_survivability_rules: EnforceSurvivabilityRules;
  may_attach_to?: MayAttachTo;
  may_replace?: MayReplace;
}
/**
 * UNDOCUMENTED.
 */
export interface Description {
  identifier: Identifier;
  [k: string]: unknown;
}
/**
 * UNDOCUMENTED.
 */
export interface MayAttachTo {
  min_sides_must_attach?: MinimumSidesMustAttach;
  auto_rotate?: AutoRotate;
  top?: Top;
  bottom?: Bottom;
  north?: North;
  south?: South;
  east?: East;
  west?: West;
  all?: All;
  sides?: Sides;
}
/**
 * UNDOCUMENTED.
 */
export interface MinimumSidesMustAttach {
  [k: string]: unknown;
}
/**
 * Automatically rotate the block to attach sensibly.
 */
export interface AutoRotate {
  [k: string]: unknown;
}