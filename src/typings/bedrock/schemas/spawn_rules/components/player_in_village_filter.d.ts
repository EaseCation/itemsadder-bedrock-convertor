/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Distance = number;
/**
 * UNDOCUMENTED.
 */
export type VillageBorderTolerance = number;

/**
 * This component lets players be filtered by whether they are in a village or not, using distance and the village border definitions.
 */
export interface PlayerInVillageFilter {
  distance?: Distance;
  village_border_tolerance?: VillageBorderTolerance;
}