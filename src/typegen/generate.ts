import { Log, Sync } from "../util/process";
import * as A from "./ast";
import * as t from "@babel/types";
import { Decls } from "./decode";

export function* generate(decls: Decls): Sync<string, Log> {
    decls.flat().map(decl => generateDecl(decl.type))
    return '';
}

const generateDecl = A.makeVisitor<A.ResolvedType, readonly t.Statement[]>()({
    Disjoint1: node => {
        // return collectAll(node.children)(params);
        return [];
    },
    Object: node => {
        const types = [...node.fields.values()].map(field => field.type);
        // return collectAll(types)(params);
        return [];
    },

    OneOf: () => [],
    Undefined: () => [],
    Boolean: () => [],
    Number: () => [],
    Bigint: () => [],
    String: () => [],
    Literal: () => [],
    Ref: () => [],
    Array: () => [],
    Tuple: () => [],
    Map: () => [],
    Set: () => [],
    Maybe: () => [],
})