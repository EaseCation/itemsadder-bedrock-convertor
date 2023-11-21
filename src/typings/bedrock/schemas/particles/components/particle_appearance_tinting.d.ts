/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Color =
  | MolangNumber[]
  | string
  | {
      gradient?: Gradient;
      interpolant?: MolangNumber1;
    };
/**
 * The minecraft molang definition that results in a float.
 */
export type MolangNumber = string | number;
export type Gradient =
  | Color1[]
  | {
      /**
       * Color.
       */
      [k: string]: string;
    }
  | [Color2 | Molang, Color2 | Molang, Color2 | Molang, ...(Color2 | Molang)[]][];
/**
 * Color.
 */
export type Color1 = string;
/**
 * Color.
 */
export type Color2 = number;
export type Molang = string;
/**
 * The minecraft molang definition that results in a float.
 */
export type MolangNumber1 = string | number;

/**
 * Color fields are special, they can be either an RGB, or a `#RRGGBB` field (or RGBA or `AARRGGBB`).  If RGB(A), the channels are from 0 to 1.  If the string `#AARRGGBB`, then the values are hex from 00 to ff.
 */
export interface ParticleAppearanceTintingComponentFor1100 {
  color?: Color;
}
