/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The initial UV of the animation.
 */
export type InitialUV =
  | ((ElementReference | ElementReference1 | VariableReference) & string)
  | []
  | [Width]
  | [Width, Height];
/**
 * A reference to an element: using the following syntax: [element_name]@[namespace_reference].[element_name_reference]
 */
export type ElementReference = string;
/**
 * A reference to an element: using the following syntax: [namespace_reference].[element_name_reference]
 */
export type ElementReference1 = string;
/**
 * A variable is a reference to a value that can be used in the UI.
 */
export type VariableReference = VariableReference1 & VariableReference2;
export type VariableReference1 = {
  [k: string]: unknown;
};
export type VariableReference2 = string;
/**
 * A variable
 */
export type Width = Width1 & Width2;
export type Width1 = ("default" | "fill") | string | number;
export type Width2 = string;
/**
 * A variable
 */
export type Height = Height1 & Height2;
export type Height1 = ("default" | "fill") | string | number;
export type Height2 = string;
