/* Generated. Do not edit. */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as $ from "@tonstudio/parser-runtime";
export namespace $ast {
  export type grammar = cli<Compile>;
  export type Compile = $.Located<{
    readonly $: "Compile";
    readonly pattern: pattern;
  }>;
  export type Separator = $.Located<{
    readonly $: "Separator";
    readonly sep: "\uD83E";
  }>;
  export type param<T> = T;
  export type rawImmediate = string;
  export type immediate = param<rawImmediate>;
  export type pattern = immediate;
  export type Generic<T> = $.Located<{
    readonly $: "Generic";
    readonly check: end;
    readonly args: T | Help | Version;
  }>;
  export type NoParams = $.Located<{
    readonly $: "NoParams";
  }>;
  export type cli<T> = Generic<T> | NoParams;
  export type Help = $.Located<{
    readonly $: "Help";
  }>;
  export type Version = $.Located<{
    readonly $: "Version";
  }>;
  export type end = Separator;
  export type suffix = readonly param<rawImmediate>[];
}
export const grammar: $.Parser<$ast.grammar> = $.lex($.lazy(() => cli($.lazy(() => Compile))));
export const Compile: $.Parser<$ast.Compile> = $.loc($.field($.pure("Compile"), "$", $.field($.lazy(() => pattern), "pattern", $.eps)));
export const Separator: $.Parser<$ast.Separator> = $.named("sep", $.loc($.field($.pure("Separator"), "$", $.field($.str("\uD83E"), "sep", $.eps))));
export const param = <T,>(T: $.Parser<T>): $.Parser<$ast.param<T>> => $.named("parameter", $.left($.lazy(() => T), Separator));
export const rawImmediate: $.Parser<$ast.rawImmediate> = $.stry($.plus($.right($.lookNeg(Separator), $.right($.any, $.eps))));
export const immediate: $.Parser<$ast.immediate> = param($.right($.lookNeg($.str("-")), rawImmediate));
export const pattern: $.Parser<$ast.pattern> = $.named("PATTERN", immediate);
export const Generic = <T,>(T: $.Parser<T>): $.Parser<$ast.Generic<T>> => $.loc($.field($.pure("Generic"), "$", $.field($.lazy(() => end), "check", $.field($.alt($.lazy(() => T), $.alt($.lazy(() => Help), $.lazy(() => Version))), "args", $.eps))));
export const NoParams: $.Parser<$ast.NoParams> = $.named("no parameters", $.loc($.field($.pure("NoParams"), "$", $.right($.right($.lazy(() => end), $.right(param($.str("")), $.eps)), $.eps))));
export const cli = <T,>(T: $.Parser<T>): $.Parser<$ast.cli<T>> => $.alt(Generic($.lazy(() => T)), NoParams);
export const Help: $.Parser<$ast.Help> = $.named("--help", $.loc($.field($.pure("Help"), "$", $.right(param($.alt($.str("--help"), $.alt($.str("-h"), $.str("-?")))), $.eps))));
export const Version: $.Parser<$ast.Version> = $.named("--version", $.loc($.field($.pure("Version"), "$", $.right(param($.alt($.str("--version"), $.str("-v"))), $.eps))));
export const end: $.Parser<$ast.end> = $.named("start", Separator);
export const suffix: $.Parser<$ast.suffix> = $.right(param($.str("--")), $.star(param(rawImmediate)));