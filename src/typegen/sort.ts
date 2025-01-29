import { tarjan } from "../util/tarjan";
import { makeMakeVisitor } from "../util/tricks";
import * as A from "./ast";

// visitor for our AST
const makeVisitor = makeMakeVisitor('$');

export function sort(decls: readonly A.TypeDecl[]): readonly (readonly A.TypeDecl[])[] {
    const declMap = new Map(decls.map(decl => [
        decl.name,
        decl,
    ] as const))
    const dependencies = new Map(decls.map(decl => [
        decl.name,
        collectRefs(decl.type)(new Set(decl.params))
    ] as const));
    const sortedDecls = tarjan(dependencies).map(group => group.map(declName => {
        const decl = declMap.get(declName);
        if (!decl) {
            throw new Error('Tarjan lost nodes');
        }
        return decl;
    }))
    return sortedDecls;
}

type Collector = (params: ReadonlySet<string>) => readonly string[]

const collectAll = (nodes: readonly A.TopLevelType[]): Collector => params => {
    return nodes.flatMap(node => collectRefs(node)(params));
};

export const collectRefs = makeVisitor<A.TopLevelType, Collector>()({
    Undefined: () => () => [],
    Boolean: () => () => [],
    Number: () => () => [],
    Bigint: () => () => [],
    String: () => () => [],
    Literal: () => () => [],
    Ref: node => params => {
        const childrenRefs = collectAll(node.params)(params);
        if (params.has(node.name)) {
            return childrenRefs;
        } else {
            return [node.name, ...childrenRefs];
        }
    },
    Disjoint: node => params => {
        return collectAll(node.children)(params);
    },
    OneOf: () => () => [],
    Array: node => collectRefs(node.child),
    Tuple: node => params => {
        return collectAll(node.children)(params);
    },
    Object: node => params => {
        const types = [...node.fields.values()].map(field => field.type);
        return collectAll(types)(params);
    },
    Map: node => params => {
        return collectAll([node.key, node.value])(params);
    },
    Set: node => collectRefs(node.value),
    Maybe: node => collectRefs(node.value),
});