/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Temperature with which this biome should selected, relative to other biomes.
 */
export type TargetTemperature = number;
/**
 * Humidity with which this biome should selected, relative to other biomes.
 */
export type TargetHumidity = number;
/**
 * Altitude with which this biome should selected, relative to other biomes.
 */
export type TargetAltitude = number;
/**
 * Weirdness with which this biome should selected, relative to other biomes.
 */
export type TargetWeirdness = number;
/**
 * Weight with which this biome should selected, relative to other biomes.
 */
export type Weight = number;

/**
 * Controls how this biome is instantiated (and then potentially modified) during world generation of the nether.
 */
export interface NetherGenerationRules {
  target_temperature?: TargetTemperature;
  target_humidity?: TargetHumidity;
  target_altitude?: TargetAltitude;
  target_weirdness?: TargetWeirdness;
  weight?: Weight;
}
