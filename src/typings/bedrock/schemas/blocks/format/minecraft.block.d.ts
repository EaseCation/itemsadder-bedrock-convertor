/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The category this block will be placed in the menu.
 */
export type MenuCategory = string;
/**
 * The identifier for this block. The name must include a namespace and must not use the Minecraft namespace unless overriding a Vanilla block.
 */
export type Identifier = string;
/**
 * If this block is experimental, it will only be registered if the world is marked as experimantal.
 */
export type IsExperimental = boolean;
/**
 * Whether or not to register this block to the creative inventory menu.
 */
export type RegisterToCreativeMenu = boolean;
/**
 * A block property.
 */
export type State =
  | PropertyValue[]
  | {
      [k: string]: unknown;
    };
/**
 * The value of this property.
 */
export type PropertyValue = boolean | number | number | string;
/**
 * The condition of event to be executed on the block.
 */
export type Condition = string;
/**
 * The event executed on the block.
 */
export type Event1 = string;
/**
 * The target of event executed on the block.
 */
export type Target = string;
/**
 * This component can be specified as a Boolean. If this component is omitted, the default value for this component is true, which will give your block the default values for its parameters (a collision box the size/shape of a regular block).
 */
export type CollisionBox =
  | boolean
  | {
      origin?: Origin;
      size?: Size;
    };
/**
 * Minimal position of the bounds of the collision box. origin is specified as [x, y, z] and must be in the range (-8, 0, -8) to (8, 16, 8), inclusive.
 */
export type Origin = [] | [X] | [X, Y] | [X, Y, Z];
export type X = number;
export type Y = number;
export type Z = number;
/**
 * Size of each side of the collision box. Size is specified as [x, y, z]. origin + size must be in the range (-8, 0, -8) to (8, 16, 8), inclusive.
 */
export type Size = [] | [X1] | [X1, Y1] | [X1, Y1, Z1];
export type X1 = number;
export type Y1 = number;
export type Z1 = number;
/**
 * The tag to check for.
 */
export type Tag = string;
/**
 * Defines the tags recipes should define to be crafted on this table. Limited to 64 tags. Each tag is limited to 64 characters.
 *
 * @maxItems 64
 */
export type CraftingTags = Tag[];
/**
 * Specifies the language file key that maps to what text will be displayed in the UI of this table. If the string given can not be resolved as a loc string, the raw string given will be displayed. If this field is omitted, the name displayed will default to the name specified in the "display_name" component. If this block has no "display_name" component, the name displayed will default to the name of the block.
 */
export type TableName = string;
/**
 * Describes the destructible by explosion properties for this block. If set to true, the block will have the default explosion resistance. If set to false, this block is indestructible by explosion. If the component is omitted, the block will have the default explosion resistance.
 */
export type DestructibleByExplosion =
  | boolean
  | {
      explosion_resistance?: ExplosionResistance;
    };
/**
 * Describes how resistant the block is to explosion. Greater values mean the block is less likely to break when near an explosion (or has higher resistance to explosions). The scale will be different for different explosion power levels. A negative value or 0 means it will easily explode; larger numbers increase level of resistance.
 */
export type ExplosionResistance = number;
/**
 * Describes the destructible by mining properties for this block. If set to true, the block will take the default number of seconds to destroy. If set to false, this block is indestructible by mining. If the component is omitted, the block will take the default number of seconds to destroy.
 */
export type DestructibleByMining =
  | boolean
  | {
      seconds_to_destroy?: SecondsToDestroy;
    };
/**
 * Sets the number of seconds it takes to destroy the block with base equipment. Greater numbers result in greater mining times.
 */
export type SecondsToDestroy = number;
/**
 * Specifies the language file key that maps to what text will be displayed when you hover over the block in your inventory and hotbar. If the string given can not be resolved as a loc string, the raw string given will be displayed. If this component is omitted, the name of the block will be used as the display name.
 */
export type DisplayName = string;
/**
 * Describes the flammable properties for this block. If set to true, default values are used. If set to false, or if this component is omitted, the block will not be able to catch on fire naturally from neighbors, but it can still be directly ignited.
 */
export type Flammable =
  | boolean
  | {
      seconds_to_destroy?: SecondsToDestroy1;
    };
/**
 * Sets the number of seconds it takes to destroy the block with base equipment. Greater numbers result in greater mining times.
 */
export type SecondsToDestroy1 = number;
/**
 * Describes the friction for this block in a range of (0.0-0.9). Friction affects an entity's movement speed when it travels on the block. Greater value results in more friction.
 */
export type Friction = number;
/**
 * The description identifier of the geometry file to use to render this block. This identifier must match an existing geometry identifier in any of the currently loaded resource packs.
 */
export type Geometry =
  | string
  | {
      identifier: Identifier1;
      bone_visibility?: BoneVisibility;
    };
/**
 * The description identifier of the geometry file to use to render this block. This identifier must match an existing geometry identifier in any of the currently loaded resource packs.
 */
export type Identifier1 = string;
/**
 * Whether or not the bone should be visible.
 */
export type BoneVisibility1 = boolean;
/**
 * The amount that light will be dampened when it passes through the block, in a range (0-15). Higher value means the light will be dampened more.
 */
export type LightDampening = number;
/**
 * The amount of light this block will emit in a range (0-15). Higher value means more light will be emitted.
 */
export type LightEmission = number;
/**
 * The path to the loot table, relative to the behavior pack.
 */
export type Loot = string;
/**
 * Sets the color of the block when rendered to a map. The color is represented as a hex value in the format "#RRGGBB". May also be expressed as an array of [R, G, B] from 0 to 255. If this component is omitted, the block will not show up on the map.
 */
export type MapColor = string | [] | [Red] | [Red, Green] | [Red, Green, Blue];
export type Red = number;
export type Green = number;
export type Blue = number;
/**
 * The material instance for a block. Maps face or material_instance names in a geometry file to an actual material instance. You can assign a material instance object to any of these faces: "up", "down", "north", "south", "east", "west", or "*". You can also give an instance the name of your choosing such as "my_instance", and then assign it to a face by doing "north":"my_instance".
 */
export type MaterialInstance =
  | string
  | {
      ambient_occlusion?: AmbientOcclusion;
      face_dimming?: FaceDimming;
      render_method?: RenderMethod;
      texture?: Texture;
    };
/**
 * Should this material have ambient occlusion applied when lighting? If true, shadows will be created around and underneath the block.
 */
export type AmbientOcclusion = boolean;
/**
 * Should this material be dimmed by the direction it's facing?
 */
export type FaceDimming = boolean;
/**
 * The render method to use. Must be one of these options: opaque - Used for a regular block texture without an alpha layer. Does not allow for transparency or translucency. double_sided - Used for completely disabling backface culling. blend - Used for a block like stained glass. Allows for transparency and translucency (slightly transparent textures). alpha_test - Used for a block like the vanilla (unstained) glass. Does not allow for translucency, only fully opaque or fully transparent textures. Also disables backface culling.
 */
export type RenderMethod = "opaque" | "double_sided" | "blend" | "alpha_test";
/**
 * Texture name for the material.
 */
export type Texture = string;
/**
 * [Experimental] Maps bone names in a geometry file to a condition that turns their rendering on/off. The condition should be a Molang query that uses block properties to determine true/false.
 */
export type PartVisibility1 = string | boolean;
/**
 * List of conditions where the block can be placed/survive. Limited to 64 conditions. Each condition is a JSON Object that must contain at least one (and can contain both) of the parameters allowed_faces or block_filter as shown below.
 *
 * @minItems 1
 */
export type Conditions = [PlacementFilter1, ...PlacementFilter1[]];
/**
 * List of any of the following strings describing which face(s) this block can be placed on: "up", "down", "north", "south", "east", "west", "side", "all". Limited to 6 faces.
 */
export type AllowedFaces = ("up" | "down" | "north" | "south" | "east" | "west" | "side" | "all")[];
/**
 * [Experimental]
 */
export type BlockFilter1 = BlockIdentifier | BlockReference;
/**
 * A minecraft block identifier.
 */
export type BlockIdentifier = string;
/**
 * A minecraft block identifier.
 */
export type BlockIdentifier1 = string;
/**
 * The key of property is the name of the block state/property, the value must be the same as the block properties accepted values.
 */
export type StateValue = boolean | number | string;
/**
 * A condition using Molang queries that results to true/false that can be used to query for blocks with certain tags.
 */
export type Molang = string;
/**
 * List of blocks that this block can be placed against in the "allowed_faces" direction. Limited to 64 blocks. Each block in this list can either be specified as a String (block name) or as a BlockDescriptor. A BlockDescriptor is an object that allows you to reference a block (or multiple blocks) based on its tags, or based on its name and states. The fields of a BlockDescriptor are described below.
 */
export type BlockFilter = BlockFilter1[];
/**
 * Defines the area of the block that is selected by the player's cursor. If set to true, default values are used. If set to false, this block is not selectable by the player's cursor. If this component is omitted, default values are used.
 */
export type SelectionBox =
  | boolean
  | {
      origin?: Origin1;
      size?: Size1;
    };
/**
 * Minimal position of the bounds of the selection box. "origin" is specified as [x, y, z] and must be in the range (-8, 0, -8) to (8, 16, 8), inclusive.
 */
export type Origin1 = [] | [X2] | [X2, Y2] | [X2, Y2, Z2];
export type X2 = number;
export type Y2 = number;
export type Z2 = number;
/**
 * Size of each side of the selection box. Size is specified as [x, y, z]. "origin" + "size" must be in the range (-8, 0, -8) to (8, 16, 8), inclusive.
 */
export type Size1 = [] | [X3] | [X3, Y3] | [X3, Y3, Z3];
export type X3 = number;
export type Y3 = number;
export type Z3 = number;
/**
 * Rotation in xxx?
 */
export type Rotation = [] | [X4] | [X4, Y4] | [X4, Y4, Z4];
/**
 * Rotation in xxx?
 */
export type X4 = number;
/**
 * Rotation in xxx?
 */
export type Y4 = number;
/**
 * Rotation in xxx?
 */
export type Z4 = number;
/**
 * UNDOCUMENTED
 */
export type Scale = [] | [X5] | [X5, Y5] | [X5, Y5, Z5];
/**
 * UNDOCUMENTED
 */
export type X5 = number;
/**
 * UNDOCUMENTED
 */
export type Y5 = number;
/**
 * UNDOCUMENTED
 */
export type Z5 = number;
/**
 * UNDOCUMENTED
 */
export type Translation = [] | [X6] | [X6, Y6] | [X6, Y6, Z6];
/**
 * UNDOCUMENTED
 */
export type X6 = number;
/**
 * UNDOCUMENTED
 */
export type Y6 = number;
/**
 * UNDOCUMENTED
 */
export type Z6 = number;
/**
 * The condition of event to be executed on the block.
 */
export type Condition1 = string;
/**
 * The event executed on the block.
 */
export type Event2 = string;
/**
 * The minimum distance in blocks that an actor needs to fall to trigger this event.
 */
export type MinimumFallDistance = number;
/**
 * The target of event executed on the block.
 */
export type Target1 = string;
/**
 * The condition of event to be executed on the block.
 */
export type Condition2 = string;
/**
 * The event executed on the block.
 */
export type Event3 = string;
/**
 * The target of event executed on the block.
 */
export type Target2 = string;
/**
 * The condition of event to be executed on the block.
 */
export type Condition3 = string;
/**
 * The event executed on the block.
 */
export type Event4 = string;
/**
 * The target of event executed on the block.
 */
export type Target3 = string;
/**
 * The condition of event to be executed on the block.
 */
export type Condition4 = string;
/**
 * The event executed on the block.
 */
export type Event5 = string;
/**
 * The target of event executed on the block.
 */
export type Target4 = string;
/**
 * The condition of event to be executed on the block.
 */
export type Condition5 = string;
/**
 * The event executed on the block.
 */
export type Event6 = string;
/**
 * The target of event executed on the block.
 */
export type Target5 = string;
/**
 * The condition of event to be executed on the block.
 */
export type Condition6 = string;
/**
 * The event executed on the block.
 */
export type Event7 = string;
/**
 * The target of event executed on the block.
 */
export type Target6 = string;
/**
 * The condition of event to be executed on the block.
 */
export type Condition7 = string;
/**
 * The event executed on the block.
 */
export type Event8 = string;
/**
 * The target of event executed on the block.
 */
export type Target7 = string;
/**
 * Describes the component that will trigger an even at a regular interval between two values.
 */
export type OnTick = string;
/**
 * Does the event loop.
 */
export type Looping = boolean;
/**
 * The Range between which the component will trigger his event.
 */
export type Range = unknown[];
/**
 * A condition using Molang queries that results to true/false. If true on the random tick, the event will be triggered. If false on the random tick, the event will not be triggered.
 */
export type Condition8 = string;
/**
 * The event that will be triggered.
 */
export type Event9 = string;
/**
 * The target of the event executed by the block
 */
export type Target8 = string;
/**
 * A Molang expression that evaluates to true or false to determine if this permutation should be used. For permutation conditions you are limited to using one Molang query: "query.block_property()"
 */
export type Condition9 = string;
/**
 * UNDOCUMENTED.
 */
export type Permutations = Permutation[];

/**
 * A custom block definition.
 */
export interface BlockDefinitions {
  description: BlockDescription;
  events?: Events;
  components: Component;
  permutations?: Permutations;
}
/**
 * The description for this block.
 */
export interface BlockDescription {
  menu_category?: MenuCategory;
  identifier: Identifier;
  is_experimental?: IsExperimental;
  register_to_creative_menu?: RegisterToCreativeMenu;
  states?: States;
}
/**
 * [HOLIDAY EXPERIMENTAL] UNDOCUMENTED.
 */
export interface States {
  [k: string]: State;
}
/**
 * UNDOCUMENTED.
 */
export interface Events {
  "minecraft:on_fall_on"?: Event;
  "minecraft:on_interact"?: Event;
  "minecraft:on_placed"?: Event;
  "minecraft:on_player_destroyed"?: Event;
  "minecraft:on_player_placing"?: Event;
  "minecraft:on_step_off"?: Event;
  "minecraft:on_step_on"?: Event;
  [k: string]: unknown;
}
/**
 * UNDOCUMENTED.
 */
export interface Event {
  condition?: Condition;
  event?: Event1;
  target?: Target;
}
/**
 * UNDOCUMENTED.
 */
export interface Component {
  "minecraft:collision_box"?: CollisionBox;
  "minecraft:crafting_table"?: CraftingTable;
  "minecraft:destructible_by_explosion"?: DestructibleByExplosion;
  "minecraft:destructible_by_mining"?: DestructibleByMining;
  "minecraft:display_name"?: DisplayName;
  "minecraft:flammable"?: Flammable;
  "minecraft:friction"?: Friction;
  "minecraft:geometry"?: Geometry;
  "minecraft:light_dampening"?: LightDampening;
  "minecraft:light_emission"?: LightEmission;
  "minecraft:loot"?: Loot;
  "minecraft:map_color"?: MapColor;
  "minecraft:material_instances"?: MaterialInstances;
  "minecraft:part_visibility"?: PartVisibility;
  "minecraft:placement_filter"?: PlacementFilter;
  "minecraft:selection_box"?: SelectionBox;
  "minecraft:transformation"?: Transformation;
  "minecraft:unit_cube"?: UnitCube;
  "minecraft:on_fall_on"?: OnFallOn;
  "minecraft:on_interact"?: OnFallOn1;
  "minecraft:on_placed"?: OnPlaced;
  "minecraft:on_player_destroyed"?: OnPlayerDestroyed;
  "minecraft:on_player_placing"?: OnPlayerPlacing;
  "minecraft:on_step_off"?: OnStepOff;
  "minecraft:on_step_on"?: OnStepOn;
  "minecraft:queued_ticking"?: RandomTicking;
  "minecraft:random_ticking"?: RandomTicking1;
}
/**
 * [Experimental] Makes your block into a custom crafting table which enables the crafting table UI and the ability to craft recipes.
 */
export interface CraftingTable {
  crafting_tags?: CraftingTags;
  table_name?: TableName;
}
/**
 * A list of bones that should be visible when rendering this block. If not specified, all bones will be visible.
 */
export interface BoneVisibility {
  [k: string]: BoneVisibility1;
}
/**
 * The material instances for a block. Maps face or material_instance names in a geometry file to an actual material instance. You can assign a material instance object to any of these faces: "up", "down", "north", "south", "east", "west", or "*". You can also give an instance the name of your choosing such as "my_instance", and then assign it to a face by doing "north":"my_instance".
 */
export interface MaterialInstances {
  [k: string]: MaterialInstance;
}
/**
 * [Experimental] Maps bone names in a geometry file to a condition that turns their rendering on/off. The condition should be a Molang query that uses block properties to determine true/false.
 */
export interface PartVisibility {
  [k: string]: PartVisibility1;
}
/**
 * [Experimental]
 */
export interface PlacementFilter {
  conditions?: Conditions;
  [k: string]: unknown;
}
/**
 * [Experimental]
 */
export interface PlacementFilter1 {
  allowed_faces?: AllowedFaces;
  block_filter?: BlockFilter;
}
export interface BlockReference {
  name?: BlockIdentifier1;
  states?: States1;
  tags?: Molang;
}
export interface States1 {
  [k: string]: StateValue;
}
/**
 * Supports rotation, scaling, and translation
 */
export interface Transformation {
  rotation?: Rotation;
  scale?: Scale;
  translation?: Translation;
}
/**
 * [Experimental] Specifies that a unit cube is to be used with tessellation.
 */
export interface UnitCube {}
/**
 * [Experimental] Describes event for this block.
 */
export interface OnFallOn {
  condition?: Condition1;
  event?: Event2;
  min_fall_distance?: MinimumFallDistance;
  target?: Target1;
  [k: string]: unknown;
}
/**
 * [Experimental] Describes event for this block.
 */
export interface OnFallOn1 {
  condition?: Condition2;
  event?: Event3;
  target?: Target2;
  [k: string]: unknown;
}
/**
 * [Experimental] Describes event for this block.
 */
export interface OnPlaced {
  condition?: Condition3;
  event?: Event4;
  target?: Target3;
  [k: string]: unknown;
}
/**
 * [Experimental] Describes event for this block.
 */
export interface OnPlayerDestroyed {
  condition?: Condition4;
  event?: Event5;
  target?: Target4;
  [k: string]: unknown;
}
/**
 * [Experimental] Describes event for this block.
 */
export interface OnPlayerPlacing {
  condition?: Condition5;
  event?: Event6;
  target?: Target5;
  [k: string]: unknown;
}
/**
 * [Experimental] Describes event for this block.
 */
export interface OnStepOff {
  condition?: Condition6;
  event?: Event7;
  target?: Target6;
  [k: string]: unknown;
}
/**
 * [Experimental] Describes event for this block.
 */
export interface OnStepOn {
  condition?: Condition7;
  event?: Event8;
  target?: Target7;
  [k: string]: unknown;
}
/**
 * [Experimental] Describes the component that will trigger an even at a regular interval between two values.
 */
export interface RandomTicking {
  on_tick?: OnTick;
  looping?: Looping;
  range?: Range;
}
/**
 * [Experimental] Triggers the specified event randomly based on the random tick speed gamerule. The random tick speed determines how often blocks are updated.
 */
export interface RandomTicking1 {
  on_tick?: OnTick1;
  condition?: Condition8;
  event?: Event9;
  target?: Target8;
}
/**
 * the event that will be triggered on random ticks.
 */
export interface OnTick1 {
  [k: string]: unknown;
}
/**
 * UNDOCUMENTED.
 */
export interface Permutation {
  condition?: Condition9;
  components?: Component1;
}
/**
 * UNDOCUMENTED.
 */
export interface Component1 {
  "minecraft:collision_box"?: CollisionBox;
  "minecraft:crafting_table"?: CraftingTable;
  "minecraft:destructible_by_explosion"?: DestructibleByExplosion;
  "minecraft:destructible_by_mining"?: DestructibleByMining;
  "minecraft:display_name"?: DisplayName;
  "minecraft:flammable"?: Flammable;
  "minecraft:friction"?: Friction;
  "minecraft:geometry"?: Geometry;
  "minecraft:light_dampening"?: LightDampening;
  "minecraft:light_emission"?: LightEmission;
  "minecraft:loot"?: Loot;
  "minecraft:map_color"?: MapColor;
  "minecraft:material_instances"?: MaterialInstances;
  "minecraft:part_visibility"?: PartVisibility;
  "minecraft:placement_filter"?: PlacementFilter;
  "minecraft:selection_box"?: SelectionBox;
  "minecraft:transformation"?: Transformation;
  "minecraft:unit_cube"?: UnitCube;
  "minecraft:on_fall_on"?: OnFallOn;
  "minecraft:on_interact"?: OnFallOn1;
  "minecraft:on_placed"?: OnPlaced;
  "minecraft:on_player_destroyed"?: OnPlayerDestroyed;
  "minecraft:on_player_placing"?: OnPlayerPlacing;
  "minecraft:on_step_off"?: OnStepOff;
  "minecraft:on_step_on"?: OnStepOn;
  "minecraft:queued_ticking"?: RandomTicking;
  "minecraft:random_ticking"?: RandomTicking1;
}
