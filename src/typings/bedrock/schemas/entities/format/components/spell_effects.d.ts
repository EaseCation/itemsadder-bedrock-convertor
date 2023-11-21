/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The level of the effect, same as used in the /effect command (0 for level I, 1 for level II, etc). Defaults to 0. NOTE: Values can be negative but its not an intentional feature
 */
export type Amplifier = number;
/**
 * Boolean value that should cause the particles emitted by the entity to be partially transparent. This does not work properly, resulting in this property having no effect. Defaults to false.
 */
export type Ambient = boolean;
/**
 * The amount of time in seconds the effect should last. This allows for fractional numbers. For example, instant effects should be set to 0.05 seconds (one tick).
 */
export type Duration = number;
/**
 * Boolean value. When set to true, applying this effect displays an animated graphic on-screen similar to the totem of undying effect. Obviously, this only works for players. Defaults to false.
 */
export type DisplayOnScreenAnimation = boolean;
/**
 * The string identifier of the status effect to add. These are the same as used in the /effect command.
 */
export type Effect = string;
/**
 * Boolean value. When set to true, the effect will be visible to the player. Defaults to true.
 */
export type Visible = boolean;
/**
 * List of effects to add to this entity after adding this component.
 */
export type AddEffects = (
  | string
  | {
      amplifier?: Amplifier;
      ambient?: Ambient;
      duration?: Duration;
      display_on_screen_animation?: DisplayOnScreenAnimation;
      effect?: Effect;
      visible?: Visible;
    }
)[];
/**
 * List of identifiers of effects to be removed from this entity after adding this component.
 */
export type RemoveEffects = SpellEffectID[] | string;
/**
 * identifier of the effect to be removed from this entity after adding this component.
 */
export type SpellEffectID = string;

/**
 * Defines what mob effects to add and remove to the entity when adding this component.
 */
export interface SpellEffects {
  add_effects?: AddEffects;
  remove_effects?: RemoveEffects;
}