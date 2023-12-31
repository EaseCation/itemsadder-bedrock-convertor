/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The amount of blocks away the entity will look at to push away from.
 */
export type BlockDistance = number;
/**
 * The weight of the push back away from blocks.
 */
export type BlockWeight = number;
/**
 * The amount of push back given to a flocker that breaches out of the water.
 */
export type BreachInfluence = number;
/**
 * The threshold in which to start applying cohesion.
 */
export type CohesionThreshold = number;
/**
 * The weight applied for the cohesion steering of the flock.
 */
export type CohesionWeight = number;
/**
 * The weight on which to apply on the goal output.
 */
export type GoalWeight = number;
/**
 * Determines the high bound amount of entities that can be allowed in the flock.
 */
export type HighFlockLimit = number;
/**
 * Tells the Flocking Component if the entity exists in water.
 */
export type InWater = boolean;
/**
 * The area around the entity that allows others to be added to the flock.
 */
export type InfluenceRadius = number;
/**
 * The distance in which the flocker will stop applying cohesion.
 */
export type InnnerCohesionThreshold = number;
/**
 * The percentage chance between 0-1 that a fish will spawn and not want to join flocks. Invalid values will be capped at the end points.
 */
export type LonerChance = number;
/**
 * Determines the low bound amount of entities that can be allowed in the flock.
 */
export type LowFlockLimit = number;
/**
 * Tells the flockers that they can only match similar entities that also match the variant, mark variants, and color data of the other potential flockers.
 */
export type MatchVariants = boolean;
/**
 * The Maximum height allowable in the air or water.
 */
export type MaximumHeight = number;
/**
 * The Minimum height allowable in the air or water.
 */
export type MinimumHeight = number;
/**
 * The distance that is determined to be to close to another flocking and to start applying separation.
 */
export type SeparationThreshold = number;
/**
 * The weight applied to the separation of the flock.
 */
export type SeparationWeight = number;
/**
 * Tells the flockers that they will follow flocks based on the center of mass.
 */
export type UseCenterOfMass = boolean;

/**
 * Allows entities to flock in groups in water or not.
 */
export interface Flocking {
  block_distance?: BlockDistance;
  block_weight?: BlockWeight;
  breach_influence?: BreachInfluence;
  cohesion_threshold?: CohesionThreshold;
  cohesion_weight?: CohesionWeight;
  goal_weight?: GoalWeight;
  high_flock_limit?: HighFlockLimit;
  in_water?: InWater;
  influence_radius?: InfluenceRadius;
  innner_cohesion_threshold?: InnnerCohesionThreshold;
  loner_chance?: LonerChance;
  low_flock_limit?: LowFlockLimit;
  match_variants?: MatchVariants;
  max_height?: MaximumHeight;
  min_height?: MinimumHeight;
  separation_threshold?: SeparationThreshold;
  separation_weight?: SeparationWeight;
  use_center_of_mass?: UseCenterOfMass;
}
