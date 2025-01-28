import { parse, ParserOptions } from "@babel/parser";
import generate from "@babel/generator";
import * as t from "@babel/types";
import { join } from "path";
import { readFile } from "fs/promises";
import { makeVisitor } from "./tricks";

type TypeDecl = {
    $: 'TypeDecl';
    name: string;
    type: Type;
    params: string[];
}
const TypeDecl = (name: string, type: Type, params: string[]): TypeDecl => ({ $: 'TypeDecl', name, type, params });

type Type = TypeNull | TypeUndefined | TypeBoolean | TypeNumber | TypeBigint | TypeString | TypeLiteral | TypeArray | TypeTuple | TypeObject | TypeUnion | TypeRef
type TypeNull = { $: 'Null' }
const TypeNull: TypeNull = { $: 'Null' }
type TypeUndefined = { $: 'Undefined' }
const TypeUndefined: TypeUndefined = { $: 'Undefined' }
type TypeBoolean = { $: 'Boolean' }
const TypeBoolean: TypeBoolean = { $: 'Boolean' }
type TypeNumber = { $: 'Number' }
const TypeNumber: TypeNumber = { $: 'Number' }
type TypeBigint = { $: 'Bigint' }
const TypeBigint: TypeBigint = { $: 'Bigint' }
type TypeString = { $: 'String' }
const TypeString: TypeString = { $: 'String' }
type TypeLiteral = { $: 'Literal', value: string }
const TypeLiteral = (value: string): TypeLiteral => ({ $: 'Literal', value })
type TypeRef = { $: 'Ref', name: string, params: Type[] }
const TypeRef = (name: string, params: Type[]): TypeRef => ({ $: 'Ref', name, params })
type TypeArray = { $: 'Array', child: Type; }
const TypeArray = (child: Type): TypeArray => ({ $: 'Array', child })
type TypeTuple = { $: 'Tuple', children: Type[] }
const TypeTuple = (children: Type[]): TypeTuple => ({ $: 'Tuple', children })
type TypeObject = { $: 'Object', fields: Record<string, Field>; }
const TypeObject = (fields: Record<string, Field>): TypeObject => ({ $: 'Object', fields })
type TypeUnion = { $: 'Union', children: Type[] }
const TypeUnion = (children: Type[]): TypeUnion => ({ $: 'Union', children })

type Field = { name: string; type: Type }
const Field = (name: string, type: Type): Field => ({ name, type });

const main = async () => {
    const fullPath = join(__dirname, 'example', 'ast.ts');
    const source = await readFile(fullPath, "utf-8");

    const options: ParserOptions = {
        sourceType: "module",
        plugins: ["typescript"],
    };
    const ast = parse(source, options);
    console.log(JSON.stringify(
        compileDecls(ast.program.body),
        null, 4
    ));

    console.error('Done');
};

const compileError = (node: t.Node): never => {
    throw new Error(`Unexpected type: ${node.type}`);
};

const compileDecls = (nodes: t.Statement[]): TypeDecl[] => {
    return nodes.map(node => compileDecl(node))
};

const compileDecl = (node: t.Statement): TypeDecl => {
    if (!t.isExportNamedDeclaration(node)) {
        throw new Error(`Only "export" are allowed, got ${node.type}`);
    }
    const decl = node.declaration;
    if (!decl) {
        throw new Error("Export without a declaration");
    }
    if (!t.isTSTypeAliasDeclaration(decl)) {
        throw new Error(`Only "type" are allowed, got ${decl.type}`);
    }
    if (decl.declare) {
        throw new Error(`Declared types are not allowed`);
    }
    return TypeDecl(
        decl.id.name,
        compileType(decl.typeAnnotation),
        compileFormalParameters(decl.typeParameters),
    );
};

const compileFormalParameters = (node: t.TSTypeParameterDeclaration | undefined | null): string[] => {
    return (node?.params ?? []).map(param => compileFormalParameter(param));
};

const compileFormalParameter = (node: t.TSTypeParameter): string => {
    if (node.in || node.out) {
        throw new Error(`Variance params are not allowed`);
    }
    if (node.const) {
        throw new Error(`"const T" is not allowed`);
    }
    if (node.default) {
        throw new Error(`" = T" is not allowed`);
    }
    if (node.constraint) {
        throw new Error(`"extends" is not allowed`);
    }
    return node.name;
};

const compileFactualParameters = (node: t.TSTypeParameterInstantiation | undefined | null): Type[] => {
    return (node?.params ?? []).map(param => compileType(param));
};

const compileField: (node: t.TSTypeElement) => Field = makeVisitor<t.TSTypeElement>()({
    TSPropertySignature: (node) => {
        const { key, typeAnnotation } = node;
        if (node.computed || !t.isIdentifier(key)) {
            throw new Error("Computed field types are not allowed");
        }
        if (node.kind) {
            throw new Error(`Getters and setters are not allowed, got ${node.kind}`);
        }
        if (node.optional) {
            throw new Error(`Optional fields are not allowed`);
        }
        if (!node.readonly) {
            console.error("All fields should be defined as readonly");
        }
        if (!typeAnnotation) {
            throw new Error("Field doesn't have a type annotation")
        }
        return Field(key.name, compileType(typeAnnotation.typeAnnotation));
    },
    TSCallSignatureDeclaration: compileError,
    TSConstructSignatureDeclaration: compileError,
    TSIndexSignature: compileError,
    TSMethodSignature: compileError,
});

const compileType: (node: t.TSType) => Type = makeVisitor<t.TSType>()({
    TSBooleanKeyword: () => TypeBoolean,
    TSBigIntKeyword: () => TypeBigint,
    TSNullKeyword: () => TypeNull,
    TSNumberKeyword: () => TypeNumber,
    TSStringKeyword: () => TypeString,
    TSUndefinedKeyword: () => TypeUndefined,
    TSLiteralType: ({ literal }) => {
        if (!t.isStringLiteral(literal)) {
            throw new Error("Only string literal types are supported");
        }
        return TypeLiteral(literal.value);
    },
    TSTypeReference: ({ typeName, typeParameters }) => {
        if (!t.isIdentifier(typeName)) {
            throw new Error("Qualified type references are not supported");
        }
        return TypeRef(typeName.name, compileFactualParameters(typeParameters));
    },
    TSTypeLiteral: (node) => {
        const fields = node.members.map(member => compileField(member));
        const fieldsRecord = Object.fromEntries(
            fields.map(field => [field.name, field] as const)
        );
        return TypeObject(fieldsRecord);
    },
    TSArrayType: (node) => TypeArray(compileType(node.elementType)),
    TSTupleType: (node) => {
        const children = node.elementTypes.map(element => {
            if (!t.isTSNamedTupleMember(element)) {
                return compileType(element);
            }
            if (element.optional) {
                throw new Error('Optional tuple arguments are not supported');
            }
            return compileType(element.elementType);
        });
        return TypeTuple(children);
    },
    TSUnionType: (node) => {
        const children = node.types.map(node => compileType(node));
        if (children.length === 0) {
            throw new Error("Union of no types doesn't make sense");
        }
        return TypeUnion(children);
    },

    TSObjectKeyword: compileError,
    TSAnyKeyword: compileError,
    TSIntrinsicKeyword: compileError,
    TSNeverKeyword: compileError,
    TSSymbolKeyword: compileError,
    TSUnknownKeyword: compileError,
    TSVoidKeyword: compileError,
    TSThisType: compileError,
    TSFunctionType: compileError,
    TSConstructorType: compileError,
    TSTypePredicate: compileError,
    TSTypeQuery: compileError,
    TSOptionalType: compileError,
    TSRestType: compileError,
    TSIntersectionType: compileError,
    TSConditionalType: compileError,
    TSInferType: compileError,
    TSParenthesizedType: compileError,
    TSTypeOperator: compileError,
    TSIndexedAccessType: compileError,
    TSMappedType: compileError,
    TSExpressionWithTypeArguments: compileError,
    TSImportType: compileError,
});

void main();