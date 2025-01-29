import * as t from "@babel/types";
import { makeMakeVisitor } from "../util/tricks";
import { filterUndefined } from "../util/array";
import * as A from './ast';
import { err as errRaw, warn as warnRaw, traverse, Log, Sync as SyncRaw, GetSyncEffectOf, define, handleSync } from "../util/process";
import { ShowAtLocation, showAtLocation } from "../util/source-error";

export const compileTypescript = compileFile;

// visitor for babel AST nodes
const makeVisitor = makeMakeVisitor("type");

type Sync<T> = SyncRaw<T, Log & ShowAtLocation>

type RawLocation = { type: t.Node["type"]; start?: number | null; end?: number | null; }
function* location(node: RawLocation) {
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
    yield* err(`Unexpected type: ${node.type}`, loc)
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

function* compileFile(node: t.File): Sync<A.TypeDecl[]> {
    return yield* compileDecls(node.program.body);
}

function* compileDecls(nodes: t.Statement[]): Sync<A.TypeDecl[]> {
    return filterUndefined(yield* traverse(nodes, compileDecl));
};

function* compileDecl(node: t.Statement): Sync<A.TypeDecl | undefined> {
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
    return A.TypeDecl(
        decl.id.name,
        yield* compileType(decl.typeAnnotation, false),
        yield* compileFormalParameters(decl.typeParameters),
    );
}

function* compileFormalParameters(node: t.TSTypeParameterDeclaration | undefined | null): Sync<string[]> {
    return yield* traverse(node?.params ?? [], compileFormalParameter);
};

function* compileFormalParameter(node: t.TSTypeParameter): Sync<string> {
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
    return node.name;
};

function* compileFactualParameters(node: t.TSTypeParameterInstantiation | undefined | null): Sync<A.Type[]> {
    return yield* traverse(node?.params ?? [], node => compileType(node, false));
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
        ? yield* compileType(typeAnnotation.typeAnnotation, false)
        : A.TypeRef("ERROR", [], loc);
    return A.Field(name, type);
}

const compileField: (node: t.TSTypeElement) => Sync<A.Field> = makeVisitor<t.TSTypeElement>()({
    TSPropertySignature: compileRegularField,
    TSCallSignatureDeclaration: badField,
    TSConstructSignatureDeclaration: badField,
    TSIndexSignature: badField,
    TSMethodSignature: badField,
});

type TypeHandler<T> = (type: T) => (isReadonly: boolean) => Sync<A.Type>

const simpleType = (type: (loc: A.Location) => A.Type): TypeHandler<t.Node> => {
    return node => function* (isReadonly) {
        const loc = yield* location(node);
        yield* noReadonly(node, isReadonly);
        return type(loc);
    };
};

const compileLiteralType: TypeHandler<t.TSLiteralType> = node => function* (isReadonly) {
    const loc = yield* location(node);
    yield* noReadonly(node, isReadonly);
    if (!t.isStringLiteral(node.literal)) {
        yield* err("Only string literal types are supported", loc);
        return A.TypeLiteral("ERROR", loc);
    }
    return A.TypeLiteral(node.literal.value, loc);
}

const compileReference: TypeHandler<t.TSTypeReference> = node => function* (isReadonly) {
    const loc = yield* location(node);
    yield* noReadonly(node, isReadonly);
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

const compileObject: TypeHandler<t.TSTypeLiteral> = node => function* (isReadonly) {
    const loc = yield* location(node);
    yield* noReadonly(node, isReadonly);
    const fields = yield* traverse(node.members, member => compileField(member));
    const fieldsRecord = new Map(
        fields.map(field => [field.name, field] as const)
    );
    return A.TypeObject(fieldsRecord, loc);
}

const compileArray: TypeHandler<t.TSArrayType> = node => function* (isReadonly) {
    const loc = yield* location(node);
    yield* mustBeReadonly(node, isReadonly);
    const child = yield* compileType(node.elementType, false);
    return A.TypeArray(child, loc);
}

const compileTuple: TypeHandler<t.TSTupleType> = node => function* (isReadonly) {
    const loc = yield* location(node);
    yield* mustBeReadonly(node, isReadonly);
    const children = yield* traverse(node.elementTypes, compileTupleElement);
    return A.TypeTuple(children, loc);
}

function* compileTupleElement(node: t.TSNamedTupleMember | t.TSType): Sync<A.Type> {
    const loc = yield* location(node);
    if (!t.isTSNamedTupleMember(node)) {
        return yield* compileType(node, false);
    }
    if (node.optional) {
        yield* err('Optional tuple arguments are not supported', loc);
    }
    return yield* compileType(node.elementType, false);
}

const compileUnion: TypeHandler<t.TSUnionType> = node => function* (isReadonly) {
    const loc = yield* location(node);
    yield* noReadonly(node, isReadonly);
    const children = yield* traverse(node.types, type => compileType(type, false));
    if (children.length === 0) {
        yield* err("Union of no types doesn't make sense", loc);
    }
    return A.TypeUnion(children, loc);
}

const badType: TypeHandler<t.TSType> = node => function* (isReadonly) {
    const loc = yield* location(node);
    yield* noReadonly(node, isReadonly);
    yield* badNode(node);
    return A.TypeRef("ERROR", [], loc);
}

const compileReadonly: TypeHandler<t.TSTypeOperator> = node => function* (isReadonly) {
    const loc = yield* location(node);
    yield* noReadonly(node, isReadonly);
    if (node.operator !== 'readonly') {
        yield* err(`Unknown type operator ${node.operator}`, loc);
    }
    return yield* compileType(node.typeAnnotation, true);
}

function* compileType(node: t.TSType, isReadonly: boolean): Sync<A.Type> {
    return yield* compileTypeCtx(node)(isReadonly);
};

const compileTypeCtx: TypeHandler<t.TSType> = makeVisitor<t.TSType>()({
    TSBooleanKeyword: simpleType(A.TypeBoolean),
    TSBigIntKeyword: simpleType(A.TypeBigint),
    TSNullKeyword: simpleType(A.TypeNull),
    TSNumberKeyword: simpleType(A.TypeNumber),
    TSStringKeyword: simpleType(A.TypeString),
    TSUndefinedKeyword: simpleType(A.TypeUndefined),

    TSLiteralType: compileLiteralType,
    TSTypeReference: compileReference,
    TSTypeLiteral: compileObject,
    TSArrayType: compileArray,
    TSTupleType: compileTuple,
    TSUnionType: compileUnion,
    TSTypeOperator: compileReadonly,
    
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