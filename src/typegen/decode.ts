import * as t from "@babel/types";
import { makeMakeVisitor } from "../util/tricks";
import { filterUndefined } from "../util/array";
import * as A from './ast';
import { err as errRaw, traverse, Log, Sync as SyncRaw } from "../util/process";
import { ShowAtLocation, showAtLocation } from "../util/source-error";
import { tarjan } from "../util/tarjan";

// TODO: "ERROR"

export type Decls = readonly (readonly A.TypeDecl[])[];

export function* compileTypescript(node: t.File, disjointTag: string): Sync<Decls> {
    const decls = yield* compileFile(node);
    // return [decls as any];
    return yield* sort(decls, disjointTag);
}

// visitor for babel AST nodes
const makeVisitor = makeMakeVisitor("type");

type Sync<T> = SyncRaw<T, Log & ShowAtLocation>

type RawLocation = { type: t.Node["type"]; start?: number | null; end?: number | null; }
function* location(node: RawLocation): Sync<A.Location> {
    if (typeof node.start !== 'number' || typeof node.end !== 'number') {
        // TODO: internal error + handler
        throw new Error(`Babel returned a node without location! ${node.type}`)
    }
    return A.Location(node.start, node.end);
}

const lift = (fn: (text: string) => Sync<void>) => {
    return function* (text: string, node: A.Location): Sync<void> {
        yield* fn(yield* showAtLocation(text, node.start, node.end));
    };
};
const err = lift(errRaw);
// const warn = lift(warnRaw);

function* badNode(node: t.Node): Sync<undefined> {
    const loc = yield* location(node);
    yield* err(`Bad type: ${node.type}`, loc)
    return undefined;
};

function* noReadonly(node: t.Node, isReadonly: boolean): Sync<undefined> {
    const loc = yield* location(node);
    if (isReadonly) {
        yield* err(`${node.type} cannot be readonly`, loc);
    }
}
function* mustBeReadonly(node: t.Node, isReadonly: boolean): Sync<undefined> {
    const loc = yield* location(node);
    if (!isReadonly) {
        yield* err(`Must be readonly`, loc);
    }
}

type PreResolveType = A.Type | A.TypeObject | A.TypeOneOf | TypeDisjoint;
type TypeDecl = { readonly $: 'TypeDecl'; readonly name: string; readonly type: PreResolveType; readonly params: readonly A.Param[]; loc: A.Location }
const TypeDecl = (name: string, type: PreResolveType, params: readonly A.Param[], loc: A.Location): TypeDecl => ({ $: 'TypeDecl', name, type, params, loc });

function* compileFile(node: t.File): Sync<readonly TypeDecl[]> {
    return yield* compileDecls(node.program.body);
}

function* compileDecls(nodes: readonly t.Statement[]): Sync<readonly TypeDecl[]> {
    return filterUndefined(yield* traverse(nodes, compileDecl));
};

function* compileDecl(node: t.Statement): Sync<TypeDecl | undefined> {
    const loc = yield* location(node);
    if (!t.isExportNamedDeclaration(node)) {
        yield* err(`Only "export" are allowed, got ${node.type}`, loc);
        return undefined;
    }
    const decl = node.declaration;
    if (!decl) {
        yield* err("Export without a declaration", loc);
        return undefined;
    }
    if (!t.isTSTypeAliasDeclaration(decl)) {
        yield* err(`Only "type" are allowed, got ${decl.type}`, loc);
        return undefined;
    }
    if (decl.declare) {
        yield* err(`Declared types are not allowed`, loc);
    }
    return TypeDecl(
        decl.id.name,
        yield* compileTypeTopLevel(decl.typeAnnotation),
        yield* compileFormalParameters(decl.typeParameters),
        loc,
    );
}

function* compileTypeTopLevel(node: t.TSType): Sync<PreResolveType> {
    if (t.isTSTypeLiteral(node)) {
        return yield* compileObject(node);
    } else if (t.isTSUnionType(node)) {
        return yield* compileUnion(node);
    } else {
        return yield* compileType(node, false, true)
    }
}

function* compileFormalParameters(node: t.TSTypeParameterDeclaration | undefined | null): Sync<readonly A.Param[]> {
    return yield* traverse(node?.params ?? [], compileFormalParameter);
};

function* compileFormalParameter(node: t.TSTypeParameter): Sync<A.Param> {
    const loc = yield* location(node);
    if (node.in || node.out) {
        yield* err(`Variance params are not allowed`, loc);
    }
    if (node.const) {
        yield* err(`"const T" is not allowed`, loc);
    }
    if (node.default) {
        yield* err(`" = T" is not allowed`, loc);
    }
    if (node.constraint) {
        yield* err(`"extends" is not allowed`, loc);
    }
    return A.Param(node.name, loc);
};

function* compileFactualParameters(node: t.TSTypeParameterInstantiation | undefined | null): Sync<readonly A.Type[]> {
    return yield* traverse(node?.params ?? [], node => compileType(node, false, false));
};

function* badField(node: t.TSTypeElement): Sync<A.Field> {
    const loc = yield* location(node);
    yield* badNode(node);
    return A.Field('ERROR', A.TypeRef("ERROR", [], loc));
}

function* compileRegularField(node: t.TSPropertySignature): Sync<A.Field> {
    const loc = yield* location(node);
    const { typeAnnotation } = node;
    if (node.computed) {
        yield* err("Computed field types are not allowed", loc);
    }
    if (!t.isIdentifier(node.key)) {
        yield* err("Computed field types are not allowed", loc);
    }
    const name = t.isIdentifier(node.key) ? node.key.name : 'ERROR';
    if (node.kind) {
        yield* err(`Getters and setters are not allowed, got ${node.kind}`, loc);
    }
    if (node.optional) {
        yield* err(`Optional fields are not allowed`, loc);
    }
    yield* mustBeReadonly(node, node.readonly ?? false);
    if (!typeAnnotation) {
        yield* err("Field doesn't have a type annotation", loc)
    }
    const type = typeAnnotation
        ? yield* compileType(typeAnnotation.typeAnnotation, false, false)
        : A.TypeRef("ERROR", [], loc);
    return A.Field(name, type);
}

const compileField = makeVisitor<t.TSTypeElement, Sync<A.Field>>()({
    TSPropertySignature: compileRegularField,
    TSCallSignatureDeclaration: badField,
    TSConstructSignatureDeclaration: badField,
    TSIndexSignature: badField,
    TSMethodSignature: badField,
});

type Context = {
    readonly isReadonly: boolean;
    readonly isTopLevel: boolean;
}
type TypeHandler<T> = (type: T) => (ctx: Context) => Sync<A.Type>

const simpleType = (type: (loc: A.Location) => A.Type): TypeHandler<t.Node> => {
    return node => function* (c) {
        const loc = yield* location(node);
        yield* noReadonly(node, c.isReadonly);
        return type(loc);
    };
};

const compileLiteralType: TypeHandler<t.TSLiteralType> = node => function* (c) {
    const loc = yield* location(node);
    yield* noReadonly(node, c.isReadonly);
    if (!t.isStringLiteral(node.literal)) {
        yield* err("Only string literal types are supported", loc);
        return A.TypeLiteral("ERROR", loc);
    }
    return A.TypeLiteral(node.literal.value, loc);
}

const compileReference: TypeHandler<t.TSTypeReference> = node => function* (c) {
    const loc = yield* location(node);
    yield* noReadonly(node, c.isReadonly);
    const params = yield* compileFactualParameters(node.typeParameters);
    if (!t.isIdentifier(node.typeName)) {
        yield* err("Qualified type references are not supported", loc);
        return A.TypeRef("ERROR", params, loc);
    }
    const name = node.typeName.name;
    if (name === 'Map' || name === 'ReadonlyMap') {
        if (name === 'Map') {
            yield* err("Map must be readonly", loc);
        }
        const [key, value] = params;
        if (params.length !== 2 || !key || !value) {
            yield* err("Map takes 2 parameters", loc);
            return A.TypeRef("ERROR", params, loc);
        }
        return A.TypeMap(key, value, loc);
    } else if (name === 'Set' || name === 'ReadonlySet') {
        if (name === 'Set') {
            yield* err("Set must be readonly", loc);
        }
        const [value] = params;
        if (params.length !== 1 || !value) {
            yield* err("Set takes 1 parameter", loc);
            return A.TypeRef("ERROR", params, loc);
        }
        return A.TypeSet(value, loc);
    } else if (name === 'Array' || name === 'ReadonlyArray') {
        yield* err("Use T[] syntax for arrays", loc);
        if (name === 'Array') {
            yield* err("Array must be readonly", loc);
        }
        const [value] = params;
        if (params.length !== 1 || !value) {
            yield* err("Array takes 1 parameter", loc);
            return A.TypeRef("ERROR", params, loc);
        }
        return A.TypeArray(value, loc);
    } else {
        return A.TypeRef(name, params, loc);
    }
}

function* compileObject(node: t.TSTypeLiteral): Sync<A.TypeObject | A.TypeRef> {
    const loc = yield* location(node);
    const fields = yield* traverse(node.members, member => compileField(member));
    const fieldsRecord = new Map(
        fields.map(field => [field.name, field] as const)
    );
    return A.TypeObject(fieldsRecord, loc);
}

const compileArray: TypeHandler<t.TSArrayType> = node => function* (c) {
    const loc = yield* location(node);
    yield* mustBeReadonly(node, c.isReadonly);
    const child = yield* compileType(node.elementType, false, false);
    return A.TypeArray(child, loc);
}

const compileTuple: TypeHandler<t.TSTupleType> = node => function* (c) {
    const loc = yield* location(node);
    yield* mustBeReadonly(node, c.isReadonly);
    const children = yield* traverse(node.elementTypes, compileTupleElement);
    return A.TypeTuple(children, loc);
}

function* compileTupleElement(node: t.TSNamedTupleMember | t.TSType): Sync<A.Type> {
    const loc = yield* location(node);
    if (!t.isTSNamedTupleMember(node)) {
        return yield* compileType(node, false, false);
    }
    if (node.optional) {
        yield* err('Optional tuple arguments are not supported', loc);
    }
    return yield* compileType(node.elementType, false, false);
}

type TypeDisjoint = { readonly $: 'Disjoint', readonly children: readonly A.TypeRef[], loc: A.Location }
const TypeDisjoint = (children: readonly A.TypeRef[], loc: A.Location): TypeDisjoint => ({ $: 'Disjoint', children, loc });

function* compileUnion(node: t.TSUnionType): Sync<TypeDisjoint | A.TypeOneOf | A.TypeRef | A.TypeMaybe> {
    const loc = yield* location(node);
    const children = yield* traverse(node.types, type => compileType(type, false, false));
    if (children.length === 0) {
        yield* err("Union of no types doesn't make sense", loc);
        return A.TypeRef("ERROR", [], loc);
    }
    const undef = children.find(child => child.$ === 'Undefined');
    if (typeof undef !== 'undefined') {
        const notUndef = children.find(child => child.$ !== 'Undefined');
        if (children.length !== 2 || !notUndef) {
            yield* err("Bad Maybe type: must have two branches", loc);
            return A.TypeRef("ERROR", [], loc);
        }
        return A.TypeMaybe(notUndef, loc);
    }
    const refs: A.TypeRef[] = [];
    const literals: string[] = [];
    for (const child of children) {
        if (child.$ === 'Ref') {
            refs.push(child);
        } else if (child.$ === 'Literal') {
            literals.push(child.value);
        }
    }
    if (refs.length === children.length) {
        return TypeDisjoint(refs, loc);
    } else if (literals.length === children.length) {
        return A.TypeOneOf(literals, loc);
    } else {
        yield* err("Only disjoint unions of objects and unions of string literals are allowed", loc);
        return A.TypeRef("ERROR", [], loc);
    }
}

const compileMaybe: TypeHandler<t.TSUnionType> = node => function* (c) {
    const loc = yield* location(node);
    const children = yield* traverse(node.types, type => compileType(type, false, false));
    if (children.length === 0) {
        yield* err("Union of no types doesn't make sense", loc);
        return A.TypeRef("ERROR", [], loc);
    }
    const undef = children.find(child => child.$ === 'Undefined');
    const notUndef = children.find(child => child.$ !== 'Undefined');
    if (children.length !== 2 || !undef || !notUndef) {
        yield* err("Bad Maybe type: must have two branches", loc);
        return A.TypeRef("ERROR", [], loc);
    }
    return A.TypeMaybe(notUndef, loc);
}

const badType: TypeHandler<t.TSType> = node => function* (c) {
    const loc = yield* location(node);
    yield* noReadonly(node, c.isReadonly);
    yield* badNode(node);
    return A.TypeRef("ERROR", [], loc);
}

const compileReadonly: TypeHandler<t.TSTypeOperator> = node => function* (c) {
    const loc = yield* location(node);
    yield* noReadonly(node, c.isReadonly);
    if (node.operator !== 'readonly') {
        yield* err(`Unknown type operator ${node.operator}`, loc);
    }
    return yield* compileType(node.typeAnnotation, true, false);
}

function* compileType(node: t.TSType, isReadonly: boolean, isTopLevel: boolean): Sync<A.Type> {
    return yield* compileTypeCtx(node)({ isReadonly, isTopLevel });
};

const compileTypeCtx = makeVisitor<t.TSType, (ctx: Context) => Sync<A.Type>>()({
    TSBooleanKeyword: simpleType(A.TypeBoolean),
    TSBigIntKeyword: simpleType(A.TypeBigint),
    TSNumberKeyword: simpleType(A.TypeNumber),
    TSStringKeyword: simpleType(A.TypeString),
    TSUndefinedKeyword: simpleType(A.TypeUndefined),

    TSLiteralType: compileLiteralType,
    TSTypeReference: compileReference,
    TSArrayType: compileArray,
    TSTupleType: compileTuple,
    TSTypeOperator: compileReadonly,
    TSUnionType: compileMaybe,

    TSTypeLiteral: badType,
    
    TSNullKeyword: badType,
    TSObjectKeyword: badType,
    TSAnyKeyword: badType,
    TSIntrinsicKeyword: badType,
    TSNeverKeyword: badType,
    TSSymbolKeyword: badType,
    TSUnknownKeyword: badType,
    TSVoidKeyword: badType,
    TSThisType: badType,
    TSFunctionType: badType,
    TSConstructorType: badType,
    TSTypePredicate: badType,
    TSTypeQuery: badType,
    TSOptionalType: badType,
    TSRestType: badType,
    TSIntersectionType: badType,
    TSConditionalType: badType,
    TSInferType: badType,
    TSParenthesizedType: badType,
    TSIndexedAccessType: badType,
    TSMappedType: badType,
    TSExpressionWithTypeArguments: badType,
    TSImportType: badType,
});

type ParamUsage = {
    // intentionally mutable
    used: boolean;
    readonly param: A.Param;
}

function* sort(
    decls: readonly TypeDecl[],
    disjointTag: string
): Sync<Decls> {
    const rawDeclMap = new Map(decls.map(decl => [
        decl.name,
        decl,
    ] as const));
    const declMap = new Map(yield* traverse(decls, function* (decl) {
        return [
            decl.name,
            yield* ensureAdt(decl, rawDeclMap, disjointTag),
        ] as const;
    }));
    const dependencies = yield* traverse(decls, function* (decl): Sync<readonly [string, readonly string[]]> {
        const usages = new Map<string, ParamUsage>(
            decl.params.map(param => [param.name, { used: false, param }] as const)
        );
        const result = [decl.name, collectRefs(decl.type)(usages)] as const;
        for (const [key, { used, param: { loc } }] of usages) {
            if (!used) {
                yield* err(`Parameter ${key} is unused`, loc);
            }
        }
        return result;
    });
    const sortedDecls = tarjan(new Map(dependencies)).map((group): readonly A.TypeDecl[] => {
        return group.map(declName => {
            const decl = declMap.get(declName);
            if (!decl) {
                // FIXME: internal error
                throw new Error(`Tarjan lost nodes ${declName}`);
            }
            return decl;
        });
    });
    return sortedDecls;
}

function* ensureAdt(
    node: TypeDecl,
    decls: ReadonlyMap<string, TypeDecl>,
    disjointTag: string,
): Sync<A.TypeDecl> {
    if (node.type.$ !== 'Disjoint') {
        return A.TypeDecl(node.name, node.type, node.params, node.loc);
    }
    const resolved = yield* traverse(node.type.children, function* (ref): Sync<readonly [string, A.TypeRef][]> {
        const referred = decls.get(ref.name);
        if (!referred) {
            yield* err('Broken reference', ref.loc);
            return [];
        }
        const { type } = referred;
        if (type.$ !== 'Object') {
            yield* err('Disjoint union must be composed of objects', ref.loc);
            return [];
        }
        const tagField = type.fields.get(disjointTag);
        if (!tagField) {
            yield* err(`Tag field is not set`, type.loc);
            return [];
        }
        if (tagField.type.$ !== 'Literal') {
            yield* err(`Tag field is not a literal`, type.loc);
            return [];
        }
        const tag = tagField.type.value;
        return [[tag, ref]] as const;
    });
    return A.TypeDecl(
        node.name,
        A.TypeDisjoint(
            new Map(resolved.flat()),
            node.type.loc,
        ),
        node.params,
        node.loc,
    )
};

type Collector = (params: Map<string, ParamUsage>) => readonly string[]

const collectAll = (nodes: readonly PreResolveType[]): Collector => params => {
    return nodes.flatMap(node => collectRefs(node)(params));
};

const collectRefs = A.makeVisitor<PreResolveType, Collector>()({
    Undefined: () => () => [],
    Boolean: () => () => [],
    Number: () => () => [],
    Bigint: () => () => [],
    String: () => () => [],
    Literal: () => () => [],
    Ref: node => params => {
        const childrenRefs = collectAll(node.params)(params);
        const paramUsage = params.get(node.name);
        if (paramUsage) {
            paramUsage.used = true;
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