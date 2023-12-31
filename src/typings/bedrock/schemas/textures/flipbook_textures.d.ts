/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type AtlasIndex = number;
/**
 * UNDOCUMENTED.
 */
export type AtlasIndex1 = string;
/**
 * UNDOCUMENTED.
 */
export type AtlasIndex2 = number;
/**
 * UNDOCUMENTED.
 */
export type AtlasIndex3 = boolean;
/**
 * A texture file.
 */
export type FlipbookTexture1 = string;
/**
 * The index of the frame.
 */
export type FrameIndex = number;
/**
 * The collection of frame index to display.
 */
export type Frames = FrameIndex[];
/**
 * UNDOCUMENTED.
 */
export type AtlasIndex4 = number;
/**
 * The amount of ticks to wait between frames.
 */
export type TicksPerFrame = number;
/**
 * The file that specifies animated textures.
 */
export type FlipbookTextureFile = FlipbookTexture[];

/**
 * A single flipbook texture.
 */
export interface FlipbookTexture {
  atlas_index?: AtlasIndex;
  atlas_tile?: AtlasIndex1;
  atlas_tile_variant?: AtlasIndex2;
  blend_frames?: AtlasIndex3;
  flipbook_texture?: FlipbookTexture1;
  frames?: Frames;
  replicate?: AtlasIndex4;
  ticks_per_frame?: TicksPerFrame;
}
