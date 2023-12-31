/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A version that tells minecraft what type of data format can be expected when reading this file.
 */
export type FormatVersion = string;
/**
 * These names are used by the animation controller JSON. Players can reference animations from the vanilla Minecraft Resource Pack or create their own. Custom animations should be in the animation folder at the root of the Resource Pack.
 */
export type AnimationReference = string;
/**
 * Whether or not attachables are enaboled.
 */
export type EnableAttachables = boolean;
/**
 * The reference to the geometry.
 */
export type GeometryReference = string;
/**
 * UNDOCUMENTED.
 */
export type QueryableGeometry = string;
/**
 * Hides or shows the possible armor.
 */
export type HideArmor = boolean;
/**
 * This determines if the item held by an entity should render fully lit up (if true), or depending on surrounding lighting.
 */
export type HeldItemIgnoresLighting = boolean;
/**
 * The entity indentifier.
 */
export type Identifier = string;
/**
 * Material reference.
 */
export type Material = string;
/**
 * The minimum engine version to be used.
 */
export type MinimumEngineVersion = string;
/**
 * Particle reference.
 */
export type Particle = string;
/**
 * Particle emitter reference.
 */
export type ParticleEmitter = string;
/**
 * A collection of Render controller definitions.
 *
 * @minItems 1
 */
export type RenderControllers = [
  (
    | RenderController
    | {
        [k: string]: RenderController1;
      }
  ),
  ...(
    | RenderController
    | {
        [k: string]: RenderController1;
      }
  )[]
];
/**
 * A single render controller definition.
 */
export type RenderController = string;
/**
 * A render controller activate on conditional.
 */
export type RenderController1 = string;
/**
 * The array of items to animate.
 *
 * @minItems 1
 */
export type Animate = [
  AnimationController | AnimationControllerCondition,
  ...(AnimationController | AnimationControllerCondition)[]
];
/**
 * A single animation or animation controller to run.
 */
export type AnimationController = string;
/**
 * A molang condition.
 */
export type Molang = string;
/**
 * Blend weight.
 */
export type BlendWeight = number;
/**
 * Clientside molang variables that are to be evaluated during the creation of the entity.
 *
 * @minItems 1
 */
export type Initialize = [Initialize1, ...Initialize1[]];
/**
 * Clientside molang variables that are to be evaluated during the creation of the entity.
 */
export type Initialize1 = string;
/**
 * Clientside molang variables that are to be evaluated during the animation.
 */
export type PreAnimation1 = string;
/**
 * Clientside molang variables that are to be evaluated during the animation.
 */
export type PreAnimation = PreAnimation1[];
/**
 * UNDOCUMENTED: parent setup.
 */
export type ParentSetup = ParentSetup1 & ParentSetup2;
export type ParentSetup1 = string | number;
export type ParentSetup2 = string;
/**
 * Scale sets the scale of the mob's geometry.
 */
export type Scale = Scale1 & Scale2;
export type Scale1 = string | number;
export type Scale2 = string;
/**
 * The minecraft molang definition that results in a float.
 */
export type ScaleX = string | number;
/**
 * The minecraft molang definition that results in a float.
 */
export type ScaleY = string | number;
/**
 * The minecraft molang definition that results in a float.
 */
export type ScaleZ = string | number;
/**
 * Bones and effects will still be updated if the entity is off screen if this expression returns anything other than 0.0.
 */
export type ShouldUpdateBonesAndEffectsOffscreen = boolean | Molang1;
/**
 * Molang definition.
 */
export type Molang1 = string;
/**
 * Effects will still be updated if the entity is off screen if this expression or `should_update_bones_and_effects_offscreen` returns anything other than 0.0.
 */
export type ShouldUpdateEffectsOffscreen = boolean | Molang2;
/**
 * Molang definition.
 */
export type Molang2 = string;
/**
 *  If a variable is public, it can be read by other mobs. See the molang `->` operator for details.
 */
export type Variable = "public";
/**
 * A sound effect definition.
 */
export type SoundEffect = string;
/**
 * The basic color of the egg.
 */
export type BaseColor = string;
/**
 * The colors of the dots on the egg.
 */
export type OverlayColor = string;
/**
 * The texture reference in item_texture.json
 */
export type Texture = string;
/**
 * The index of the texture.
 */
export type TextureIndex = number;
/**
 * A reference to a texture in the resourcepack.
 */
export type Texture1 = string;

/**
 * A client side entity definition.
 */
export interface ActorEntity1100 {
  format_version: FormatVersion;
  "minecraft:client_entity": ClientEntity;
}
/**
 * The entity description for clientside rendering, animations and models.
 */
export interface ClientEntity {
  description: Description;
}
/**
 * The entity description for clientside rendering, animations and models.
 */
export interface Description {
  animations?: Animations;
  enable_attachables?: EnableAttachables;
  geometry?: Geometry;
  queryable_geometry?: QueryableGeometry;
  hide_armor?: HideArmor;
  held_item_ignores_lighting?: HeldItemIgnoresLighting;
  identifier: Identifier;
  materials?: Materials;
  min_engine_version?: MinimumEngineVersion;
  particle_effects?: ParticleEffects;
  particle_emitters?: ParticleEmitters;
  render_controllers?: RenderControllers;
  scripts?: Scripts;
  sound_effects?: SoundEffects;
  spawn_egg?: SpawnEgg;
  textures?: Textures;
}
/**
 * These names are used by the animation controller JSON. Players can reference animations from the vanilla Minecraft Resource Pack or create their own. Custom animations should be in the animation folder at the root of the Resource Pack.
 */
export interface Animations {
  [k: string]: AnimationReference;
}
/**
 * The reference to defined geometries in `<resource pack>/models/'.
 */
export interface Geometry {
  [k: string]: GeometryReference;
}
/**
 * A collection of material definitions.
 */
export interface Materials {
  [k: string]: Material;
}
/**
 * A collection of particle definitions.
 */
export interface ParticleEffects {
  [k: string]: Particle;
}
/**
 * A collection of particle emitters definitions.
 */
export interface ParticleEmitters {
  [k: string]: ParticleEmitter;
}
/**
 * The place where variables, and animations / controller to be run is specified.
 */
export interface Scripts {
  animate?: Animate;
  initialize?: Initialize;
  pre_animation?: PreAnimation;
  parent_setup?: ParentSetup;
  scale?: Scale;
  scalex?: ScaleX;
  scaley?: ScaleY;
  scalez?: ScaleZ;
  should_update_bones_and_effects_offscreen?: ShouldUpdateBonesAndEffectsOffscreen;
  should_update_effects_offscreen?: ShouldUpdateEffectsOffscreen;
  variables?: Variables;
}
/**
 * A single animation or animation controller to run on condition.
 */
export interface AnimationControllerCondition {
  [k: string]: Molang | BlendWeight;
}
/**
 *  A list of variables that need certain settings applied to them. Currently, for the client, only `public` is supported.
 */
export interface Variables {
  [k: string]: Variable;
}
/**
 * A collection of sound effect definition.
 */
export interface SoundEffects {
  [k: string]: SoundEffect;
}
/**
 * The definition of how the spawn_egg icon looks like.
 */
export interface SpawnEgg {
  base_color?: BaseColor;
  overlay_color?: OverlayColor;
  texture?: Texture;
  texture_index?: TextureIndex;
}
/**
 * A collection of references to textures in the resourcepack.
 */
export interface Textures {
  [k: string]: Texture1;
}
