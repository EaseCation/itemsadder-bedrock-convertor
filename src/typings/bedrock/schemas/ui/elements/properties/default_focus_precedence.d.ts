/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * The default focus precedence of the element.
 */
export type DefaultFocusPrecedence = number | ((ElementReference | ElementReference1 | VariableReference) & string);
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
