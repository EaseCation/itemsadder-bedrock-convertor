/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * UNDOCUMENTED.
 */
export type Function = "set_book_contents";
/**
 * UNDOCUMENTED.
 */
export type Author = string;
/**
 * UNDOCUMENTED.
 */
export type Title = string;
/**
 * UNDOCUMENTED.
 */
export type Pages = string[];

/**
 * The function set_book_contents.
 */
export interface SetBookContents {
  function: Function;
  author: Author;
  title: Title;
  pages: Pages;
}