import generateTs from "@babel/generator";
import * as t from "@babel/types";
import { Log, Sync } from "../util/process";
import * as A from "./ast";
import { Decls } from "./decode";
import { filterUndefined } from "../util/array";

const keywords: Set<string> = new Set([
    'abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char',
    'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else',
    'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for',
    'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface',
    'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public',
    'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws',
    'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield',

    'as', 'type', 'interface', 'never', 'Function', 'string', 'number', 'boolean',
]);

const typesImport = t.identifier('$');

export function* generate(
    decls: Decls,
    filePath: string,
    disjointTag: string,
): Sync<string, Log> {
    const result: t.Statement[] = [];
    result.push(t.importDeclaration(
        [t.importNamespaceSpecifier(typesImport)],
        t.stringLiteral(filePath),
    ))
    for (const { name, type, params } of decls.flat()) {
        result.push(reexport(name, params));
        if (type.$ === 'Object') {
            result.push(...generateCodec(
                name,
                type.fields,
                params,
                disjointTag,
            ));
        } else if (type.$ === 'OneOf') {
            result.push(generateOneOf(
                name,
                [...type.children.values()],
            ));
        }
    }
    return generateTs(t.program(result)).code;
}

const reexport = (name: string, params: readonly A.Param[]): t.Statement => {
    const id = t.tsTypeReference(t.tsQualifiedName(
        typesImport,
        t.identifier(name)
    ));
    if (params.length > 0) {
        id.typeParameters = t.tsTypeParameterInstantiation(
            params.map(param => t.tsTypeReference(t.identifier(param.name)))
        );
    }
    const typeDecl = t.tsTypeAliasDeclaration(
        t.identifier(name),
        params.length > 0
            ? t.tsTypeParameterDeclaration(
                params.map(param => t.tsTypeParameter(
                    undefined, undefined, param.name
                ))
            )
            : undefined,
        id
    );
    return t.exportNamedDeclaration(typeDecl);
};

const generateOneOf = (
    name: string,
    values: readonly string[],
): t.Statement => {
    const func = t.arrayExpression(
        values.map(value => t.stringLiteral(value))
    );
    const varName = t.identifier("all" + name);
    varName.typeAnnotation = t.tsTypeAnnotation(
        t.tsArrayType(
            t.tsTypeReference(
                t.tsQualifiedName(typesImport, t.identifier(name))
            )
        )
    );
    const decl = t.variableDeclaration("const", [
        t.variableDeclarator(varName, func)
    ]);
    return t.exportNamedDeclaration(decl);
};

const generateCodec = (
    name: string,
    fields: ReadonlyMap<string, A.Field>,
    genericParams: readonly A.Param[],
    disjointTag: string,
) => {
    const result: t.ExportNamedDeclaration[] = [];
    const paramsSet = new Set(
        genericParams.map(param => param.name)
    );
    const params = [...fields.values()]
        .map(field => generateParam(field, paramsSet))
    const body = t.objectExpression(
        params.map(param => param.property),
    );
    const consFunc = t.arrowFunctionExpression(
        filterUndefined(params.map(param => param.param)),
        body,
    );
    const qualName = t.tSTypeReference(
        t.tsQualifiedName(typesImport, t.identifier(name))
    );
    if (genericParams.length > 0) {
        consFunc.typeParameters = t.tsTypeParameterDeclaration(
            genericParams.map(param => {
                return t.tsTypeParameter(undefined, undefined, param.name);
            })
        );
        qualName.typeParameters = t.tsTypeParameterInstantiation(
            genericParams.map(param => {
                return t.tsTypeReference(t.identifier(param.name));
            })
        );
    }
    consFunc.returnType = t.tsTypeAnnotation(qualName);
    const consDecl = t.variableDeclaration("const", [
        t.variableDeclarator(t.identifier(name), consFunc)
    ]);
    result.push(t.exportNamedDeclaration(consDecl));

    const destParam = t.identifier("$value");
    const tagValue = fields.get(disjointTag)?.type;
    const foundTag = tagValue?.$ === 'Literal'
        ? tagValue.value
        : undefined;
    const destFunc = t.arrowFunctionExpression(
        [destParam],
        t.binaryExpression(
            "===",
            t.memberExpression(
                destParam,
                t.identifier(disjointTag)
            ),
            t.stringLiteral(foundTag ?? ""),
        )
    );
    const destDecl = t.variableDeclaration("const", [
        t.variableDeclarator(t.identifier("is" + name), destFunc)
    ]);
    if (foundTag) {
        result.push(t.exportNamedDeclaration(destDecl));
    }

    return result;
};

const generateParam = (
    node: A.Field,
    genericParams: ReadonlySet<string>
): { param: t.Identifier | undefined, property: t.ObjectProperty } => {
    const paramName = t.identifier(node.name);
    const tsType = generateType(node.type)(genericParams);
    const isKeyword = keywords.has(node.name)
    const renamed = isKeyword
        ? t.identifier(`${node.name}_`)
        : paramName;
    renamed.typeAnnotation = t.tsTypeAnnotation(tsType);
    const property = node.type.$ === 'Literal'
        ? t.objectProperty(paramName, t.stringLiteral(node.type.value))
        : t.objectProperty(paramName, renamed, false, !isKeyword);
    const param = node.type.$ === 'Literal' ? undefined : renamed;
    return { param, property };
};

const generateType = A.makeVisitor<A.TopLevelType, (genericParams: ReadonlySet<string>) => t.TSType>()({
    Undefined: () => () => t.tsUndefinedKeyword(),
    Boolean: () => () => t.tsBooleanKeyword(),
    Number: () => () => t.tsNumberKeyword(),
    Bigint: () => () => t.tsBigIntKeyword(),
    String: () => () => t.tsStringKeyword(),
    Literal: node => () => t.tsLiteralType(t.stringLiteral(node.value)),
    Ref: node => genericParams => {
        const id = t.identifier(node.name);
        const name = genericParams.has(node.name)
            ? id
            : t.tsQualifiedName(typesImport, id);
        const params = node.params.length > 0
            ? t.tsTypeParameterInstantiation(
                node.params.map(param => generateType(param)(genericParams))
            )
            : undefined;
        return t.tsTypeReference(name, params);
    },
    Object: node => gp => {
        const members = [...node.fields.values()]
            .map(field => generateField(field, gp));
        return t.tsTypeLiteral(members);
    },
    Disjoint: node => gp => {
        const refs = [...node.children.values()].map(child => generateType(child)(gp));
        return t.tsUnionType(refs);
    },
    OneOf: node => gp => {
        const strings = node.children.map(child => t.tsLiteralType(t.stringLiteral(child)));
        return t.tsUnionType(strings);
    },
    Array: node => gp => {
        return t.tsArrayType(generateType(node.child)(gp));
    },
    Tuple: node => gp => {
        return t.tsTupleType(node.children.map(child => generateType(child)(gp)))
    },
    Map: node => gp => {
        const params = t.tsTypeParameterInstantiation([
            generateType(node.key)(gp),
            generateType(node.value)(gp),
        ]);
        return t.tsTypeReference(t.identifier('ReadonlyMap'), params);
    },
    Set: node => gp => {
        const params = t.tsTypeParameterInstantiation([
            generateType(node.value)(gp),
        ]);
        return t.tsTypeReference(t.identifier('ReadonlySet'), params);
    },
    Maybe: node => gp => {
        return t.tsUnionType([
            generateType(node.value)(gp),
            t.tsUndefinedKeyword(),
        ]);
    },
});

const generateField = (
    node: A.Field,
    genericParams: ReadonlySet<string>,
): t.TSPropertySignature => {
    const type = generateType(node.type)(genericParams);
    return t.tsPropertySignature(
        t.identifier(node.name),
        t.tsTypeAnnotation(type),
    )
};