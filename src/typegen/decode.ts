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

type Located = {
    start?: number | null;
    end?: number | null;
};
const lift = (fn: (text: string) => Sync<void>) => {
    return function* (text: string, node: Located): Sync<void> {
        if (typeof node.start !== 'number' || typeof node.end !== 'number') {
            yield* fn(text)
        } else {
            yield* fn(yield* showAtLocation(text, node.start, node.end))
        }
    };
};
const err = lift(errRaw);
const warn = lift(warnRaw);

function* badNode(node: t.Node): Sync<undefined> {
    yield* err(`Unexpected type: ${node.type}`, node)
    return undefined;
};

function* compileFile(node: t.File): Sync<A.TypeDecl[]> {
    return yield* compileDecls(node.program.body);
}

function* compileDecls(nodes: t.Statement[]): Sync<A.TypeDecl[]> {
    return filterUndefined(yield* traverse(nodes, compileDecl));
};

function* compileDecl(node: t.Statement): Sync<A.TypeDecl | undefined> {
    if (!t.isExportNamedDeclaration(node)) {
        yield* err(`Only "export" are allowed, got ${node.type}`, node);
        return undefined;
    }
    const decl = node.declaration;
    if (!decl) {
        yield* err("Export without a declaration", node);
        return undefined;
    }
    if (!t.isTSTypeAliasDeclaration(decl)) {
        yield* err(`Only "type" are allowed, got ${decl.type}`, node);
        return undefined;
    }
    if (decl.declare) {
        yield* err(`Declared types are not allowed`, node);
    }
    return A.TypeDecl(
        decl.id.name,
        yield* compileType(decl.typeAnnotation),
        yield* compileFormalParameters(decl.typeParameters),
    );
}

function* compileFormalParameters(node: t.TSTypeParameterDeclaration | undefined | null): Sync<string[]> {
    return yield* traverse(node?.params ?? [], compileFormalParameter);
};

function* compileFormalParameter(node: t.TSTypeParameter): Sync<string> {
    if (node.in || node.out) {
        yield* err(`Variance params are not allowed`, node);
    }
    if (node.const) {
        yield* err(`"const T" is not allowed`, node);
    }
    if (node.default) {
        yield* err(`" = T" is not allowed`, node);
    }
    if (node.constraint) {
        yield* err(`"extends" is not allowed`, node);
    }
    return node.name;
};

function* compileFactualParameters(node: t.TSTypeParameterInstantiation | undefined | null): Sync<A.Type[]> {
    return yield* traverse(node?.params ?? [], compileType);
};

function* badField(node: t.TSTypeElement): Sync<A.Field> {
    yield* badNode(node);
    return A.Field('ERROR', A.TypeRef("ERROR", []));
}

function* compileRegularField(node: t.TSPropertySignature): Sync<A.Field> {
    const { typeAnnotation } = node;
    if (node.computed) {
        yield* err("Computed field types are not allowed", node);
    }
    if (!t.isIdentifier(node.key)) {
        yield* err("Computed field types are not allowed", node);
    }
    const name = t.isIdentifier(node.key) ? node.key.name : 'ERROR';
    if (node.kind) {
        yield* err(`Getters and setters are not allowed, got ${node.kind}`, node);
    }
    if (node.optional) {
        yield* err(`Optional fields are not allowed`, node);
    }
    if (!node.readonly) {
        yield* warn("All fields should be defined as readonly", node);
    }
    if (!typeAnnotation) {
        yield* err("Field doesn't have a type annotation", node)
    }
    const type = typeAnnotation
        ? yield* compileType(typeAnnotation.typeAnnotation)
        : A.TypeRef("ERROR", []);
    return A.Field(name, type);
}

const compileField: (node: t.TSTypeElement) => Sync<A.Field> = makeVisitor<t.TSTypeElement>()({
    TSPropertySignature: compileRegularField,
    TSCallSignatureDeclaration: badField,
    TSConstructSignatureDeclaration: badField,
    TSIndexSignature: badField,
    TSMethodSignature: badField,
});

const simpleType = (type: A.Type) => {
    // This trickery is to display name of the function
    // differently in error call stack
    const name = `simpleType(${type.$})`;
    const object = {
        [name]: function* (): Sync<A.Type> {
            return type;
        },
    };
    const fn = object[name];
    if (!fn) {
        throw new Error("Impossible");
    }
    return fn;
};

function* compileLiteralType(node: t.TSLiteralType): Sync<A.TypeLiteral> {
    if (!t.isStringLiteral(node.literal)) {
        yield* err("Only string literal types are supported", node);
        return A.TypeLiteral("ERROR");
    }
    return A.TypeLiteral(node.literal.value);
}

function* compileReference(node: t.TSTypeReference): Sync<A.TypeRef> {
    const params = yield* compileFactualParameters(node.typeParameters);
    if (!t.isIdentifier(node.typeName)) {
        yield* err("Qualified type references are not supported", node);
        return A.TypeRef("ERROR", params);
    }
    return A.TypeRef(node.typeName.name, params);
}

function* compileObject(node: t.TSTypeLiteral): Sync<A.TypeObject> {
    const fields = yield* traverse(node.members, member => compileField(member));
    const fieldsRecord = Object.fromEntries(
        fields.map(field => [field.name, field] as const)
    );
    return A.TypeObject(fieldsRecord);
}

function* compileArray(node: t.TSArrayType): Sync<A.TypeArray> {
    const child = yield* compileType(node.elementType);
    return A.TypeArray(child);
}

function* compileTuple(node: t.TSTupleType): Sync<A.TypeTuple> {
    const children = yield* traverse(node.elementTypes, compileTupleElement);
    return A.TypeTuple(children);
}

function* compileTupleElement(node: t.TSNamedTupleMember | t.TSType): Sync<A.Type> {
    if (!t.isTSNamedTupleMember(node)) {
        return yield* compileType(node);
    }
    if (node.optional) {
        yield* err('Optional tuple arguments are not supported', node);
    }
    return yield* compileType(node.elementType);
}

function* compileUnion(node: t.TSUnionType): Sync<A.TypeUnion> {
    const children = yield* traverse(node.types, compileType);
    if (children.length === 0) {
        yield* err("Union of no types doesn't make sense", node);
    }
    return A.TypeUnion(children);
}

function* badType(node: t.TSType): Sync<A.Type> {
    yield* badNode(node);
    return A.TypeRef("ERROR", []);
}

const compileType: (node: t.TSType) => Sync<A.Type> = makeVisitor<t.TSType>()({
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
    TSTypeOperator: badType,
    TSIndexedAccessType: badType,
    TSMappedType: badType,
    TSExpressionWithTypeArguments: badType,
    TSImportType: badType,
});