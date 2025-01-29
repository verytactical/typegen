export type Address = {}
export type Cell = {}
export type Slice = {}
export type SrcInfo = {}

export type AstModule = {
    readonly kind: "module";
    readonly imports: AstImport[];
    readonly items: AstModuleItem[];
    readonly id: number;
};

export type AstImport = {
    readonly kind: "import";
    readonly path: AstString;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstModuleItem =
    | AstPrimitiveTypeDecl
    | AstFunctionDef
    | AstAsmFunctionDef
    | AstNativeFunctionDecl
    | AstConstantDef
    | AstStructDecl
    | AstMessageDecl
    | AstContract
    | AstTrait;

export type AstTypeDecl =
    | AstPrimitiveTypeDecl
    | AstStructDecl
    | AstMessageDecl
    | AstContract
    | AstTrait;

export type AstPrimitiveTypeDecl = {
    readonly kind: "primitive_type_decl";
    readonly name: AstId;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstFunctionDef = {
    readonly kind: "function_def";
    readonly attributes: AstFunctionAttribute[];
    readonly name: AstId;
    readonly return: AstType | null;
    readonly params: AstTypedParameter[];
    readonly statements: AstStatement[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstAsmFunctionDef = {
    readonly kind: "asm_function_def";
    readonly shuffle: AstAsmShuffle;
    readonly attributes: AstFunctionAttribute[];
    readonly name: AstId;
    readonly return: AstType | null;
    readonly params: AstTypedParameter[];
    readonly instructions: AstAsmInstruction[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstAsmInstruction = string;
export type AstAsmShuffle = {
    readonly args: AstId[];
    readonly ret: AstNumber[];
};

export type AstFunctionDecl = {
    readonly kind: "function_decl";
    readonly attributes: AstFunctionAttribute[];
    readonly name: AstId;
    readonly return: AstType | null;
    readonly params: AstTypedParameter[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstNativeFunctionDecl = {
    readonly kind: "native_function_decl";
    readonly attributes: AstFunctionAttribute[];
    readonly name: AstId;
    readonly nativeName: AstFuncId;
    readonly params: AstTypedParameter[];
    readonly return: AstType | null;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstConstantDef = {
    readonly kind: "constant_def";
    readonly attributes: AstConstantAttribute[];
    readonly name: AstId;
    readonly type: AstType;
    readonly initializer: AstExpression;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstConstantDecl = {
    readonly kind: "constant_decl";
    readonly attributes: AstConstantAttribute[];
    readonly name: AstId;
    readonly type: AstType;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStructDecl = {
    readonly kind: "struct_decl";
    readonly name: AstId;
    readonly fields: AstFieldDecl[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstMessageDecl = {
    readonly kind: "message_decl";
    readonly name: AstId;
    readonly opcode: AstExpression | null;
    readonly fields: AstFieldDecl[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstContract = {
    readonly kind: "contract";
    readonly name: AstId;
    readonly traits: AstId[];
    readonly attributes: AstContractAttribute[];
    readonly declarations: AstContractDeclaration[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstTrait = {
    readonly kind: "trait";
    readonly name: AstId;
    readonly traits: AstId[];
    readonly attributes: AstContractAttribute[];
    readonly declarations: AstTraitDeclaration[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstContractDeclaration =
    | AstFieldDecl
    | AstFunctionDef
    | AstAsmFunctionDef
    | AstContractInit
    | AstReceiver
    | AstConstantDef;

export type AstTraitDeclaration =
    | AstFieldDecl
    | AstFunctionDef
    | AstAsmFunctionDef
    | AstFunctionDecl
    | AstReceiver
    | AstConstantDef
    | AstConstantDecl;

export type AstFieldDecl = {
    readonly kind: "field_decl";
    readonly name: AstId;
    readonly type: AstType;
    readonly initializer: AstExpression | null;
    readonly as: AstId | null;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstReceiver = {
    readonly kind: "receiver";
    readonly selector: AstReceiverKind;
    readonly statements: AstStatement[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstContractInit = {
    readonly kind: "contract_init";
    readonly params: AstTypedParameter[];
    readonly statements: AstStatement[];
    readonly id: number;
    readonly loc: SrcInfo;
};

//
// Statements
//

export type AstStatement =
    | AstStatementLet
    | AstStatementReturn
    | AstStatementExpression
    | AstStatementAssign
    | AstStatementAugmentedAssign
    | AstStatementCondition
    | AstStatementWhile
    | AstStatementUntil
    | AstStatementRepeat
    | AstStatementTry
    | AstStatementForEach
    | AstStatementDestruct
    | AstStatementBlock;

export type AstStatementLet = {
    readonly kind: "statement_let";
    readonly name: AstId;
    readonly type: AstType | null;
    readonly expression: AstExpression;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementReturn = {
    readonly kind: "statement_return";
    readonly expression: AstExpression | null;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementExpression = {
    readonly kind: "statement_expression";
    readonly expression: AstExpression;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementAssign = {
    readonly kind: "statement_assign";
    readonly path: AstExpression;
    readonly expression: AstExpression;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstAugmentedAssignOperation =
    | "+"
    | "-"
    | "*"
    | "/"
    | "&&"
    | "||"
    | "%"
    | "|"
    | "<<"
    | ">>"
    | "&"
    | "^";

export type AstStatementAugmentedAssign = {
    readonly kind: "statement_augmentedassign";
    readonly op: AstAugmentedAssignOperation;
    readonly path: AstExpression;
    readonly expression: AstExpression;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementCondition = {
    readonly kind: "statement_condition";
    readonly condition: AstExpression;
    readonly trueStatements: AstStatement[];
    readonly falseStatements: AstStatement[] | null;
    readonly elseif: AstStatementCondition | null;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementWhile = {
    readonly kind: "statement_while";
    readonly condition: AstExpression;
    readonly statements: AstStatement[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementUntil = {
    readonly kind: "statement_until";
    readonly condition: AstExpression;
    readonly statements: AstStatement[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementRepeat = {
    readonly kind: "statement_repeat";
    readonly iterations: AstExpression;
    readonly statements: AstStatement[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementTry = {
    readonly kind: "statement_try";
    statements: AstStatement[];
    readonly catchBlock: {
        readonly catchName: AstId;
        readonly catchStatements: AstStatement[];
    } | undefined;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementForEach = {
    readonly kind: "statement_foreach";
    readonly keyName: AstId;
    readonly valueName: AstId;
    readonly map: AstExpression;
    readonly statements: AstStatement[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementDestruct = {
    readonly kind: "statement_destruct";
    readonly type: AstTypeId;
    readonly identifiers: Map<string, [AstId, AstId]>;
    readonly ignoreUnspecifiedFields: boolean;
    readonly expression: AstExpression;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStatementBlock = {
    readonly kind: "statement_block";
    readonly statements: AstStatement[];
    readonly id: number;
    readonly loc: SrcInfo;
};

//
// Types
//

export type AstType =
    | AstTypeId
    | AstOptionalType
    | AstMapType
    | AstBouncedMessageType;

export type AstTypeId = {
    readonly kind: "type_id";
    readonly text: string;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstOptionalType = {
    readonly kind: "optional_type";
    readonly typeArg: AstType;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstMapType = {
    readonly kind: "map_type";
    readonly keyType: AstTypeId;
    readonly keyStorageType: AstId | null;
    readonly valueType: AstTypeId;
    readonly valueStorageType: AstId | null;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstBouncedMessageType = {
    readonly kind: "bounced_message_type";
    readonly messageType: AstTypeId;
    readonly id: number;
    readonly loc: SrcInfo;
};

//
// Expressions
//

export type AstExpression =
    | AstOpBinary
    | AstOpUnary
    | AstConditional
    | AstMethodCall
    | AstFieldAccess
    | AstStaticCall
    | AstStructInstance
    | AstId
    | AstInitOf
    | AstString
    | AstLiteral;

export type AstLiteral =
    | AstNumber
    | AstBoolean
    | AstNull
    | AstSimplifiedString
    | AstAddress
    | AstCell
    | AstSlice
    | AstCommentValue
    | AstStructValue;

export type AstBinaryOperation =
    | "+"
    | "-"
    | "*"
    | "/"
    | "!="
    | ">"
    | "<"
    | ">="
    | "<="
    | "=="
    | "&&"
    | "||"
    | "%"
    | "<<"
    | ">>"
    | "&"
    | "|"
    | "^";

export type AstOpBinary = {
    readonly kind: "op_binary";
    readonly op: AstBinaryOperation;
    readonly left: AstExpression;
    readonly right: AstExpression;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstUnaryOperation = "+" | "-" | "!" | "!!" | "~";

export type AstOpUnary = {
    readonly kind: "op_unary";
    readonly op: AstUnaryOperation;
    readonly operand: AstExpression;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstFieldAccess = {
    readonly kind: "field_access";
    readonly aggregate: AstExpression; // contract, trait, struct, message
    readonly field: AstId;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstMethodCall = {
    readonly kind: "method_call";
    readonly self: AstExpression; // anything with a method
    readonly method: AstId;
    readonly args: AstExpression[];
    readonly id: number;
    readonly loc: SrcInfo;
};

// builtins or top-level (module) functions
export type AstStaticCall = {
    readonly kind: "static_call";
    readonly function: AstId;
    readonly args: AstExpression[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStructInstance = {
    readonly kind: "struct_instance";
    readonly type: AstId;
    readonly args: AstStructFieldInitializer[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStructFieldInitializer = {
    readonly kind: "struct_field_initializer";
    readonly field: AstId;
    readonly initializer: AstExpression;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstInitOf = {
    readonly kind: "init_of";
    readonly contract: AstId;
    readonly args: AstExpression[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstConditional = {
    readonly kind: "conditional";
    readonly condition: AstExpression;
    readonly thenBranch: AstExpression;
    readonly elseBranch: AstExpression;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstId = {
    readonly kind: "id";
    readonly text: string;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstFuncId = {
    readonly kind: "func_id";
    readonly text: string;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstDestructMapping = {
    readonly kind: "destruct_mapping";
    readonly field: AstId;
    readonly name: AstId;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstDestructEnd = {
    readonly kind: "destruct_end";
    readonly ignoreUnspecifiedFields: boolean;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstNumber = {
    readonly kind: "number";
    readonly base: number;
    readonly value: bigint;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstBoolean = {
    readonly kind: "boolean";
    readonly value: boolean;
    readonly id: number;
    readonly loc: SrcInfo;
};

// An AstSimplifiedString is a string in which escaping characters, like '\\' has been simplified, e.g., '\\' simplified to '\'.
// An AstString is not a literal because it may contain escaping characters that have not been simplified, like '\\'.
// AstSimplifiedString is always produced by the interpreter, never directly by the parser. The parser produces AstStrings, which
// then get transformed into AstSimplifiedString by the interpreter.
export type AstSimplifiedString = {
    readonly kind: "simplified_string";
    readonly value: string;
    readonly id: number;
    readonly loc: SrcInfo;
};

/**
 * @deprecated AstSimplifiedString
 */
export type AstString = {
    readonly kind: "string";
    readonly value: string;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstNull = {
    readonly kind: "null";
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstAddress = {
    readonly kind: "address";
    readonly value: Address;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstCell = {
    readonly kind: "cell";
    readonly value: Cell;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstSlice = {
    readonly kind: "slice";
    readonly value: Slice;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstCommentValue = {
    readonly kind: "comment_value";
    readonly value: string;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStructValue = {
    readonly kind: "struct_value";
    readonly type: AstId;
    readonly args: AstStructFieldValue[];
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstStructFieldValue = {
    readonly kind: "struct_field_value";
    readonly field: AstId;
    readonly initializer: AstLiteral;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstConstantAttributeName = "virtual" | "override" | "abstract";

export type AstConstantAttribute = {
    readonly type: AstConstantAttributeName;
    readonly loc: SrcInfo;
};

export type AstContractAttribute = {
    readonly type: "interface";
    readonly name: AstString;
    readonly loc: SrcInfo;
};

export type AstFunctionAttributeGet = {
    readonly kind: "function_attribute";
    readonly type: "get";
    readonly methodId: AstExpression | null;
    readonly loc: SrcInfo;
};

export type AstFunctionAttributeName =
    | "mutates"
    | "extends"
    | "virtual"
    | "abstract"
    | "override"
    | "inline";

export type AstFunctionAttributeRest = {
    readonly kind: "function_attribute";
    readonly type: AstFunctionAttributeName;
    readonly loc: SrcInfo;
};

export type AstFunctionAttribute =
    | AstFunctionAttributeGet
    | AstFunctionAttributeRest;

export type AstTypedParameter = {
    readonly kind: "typed_parameter";
    readonly name: AstId;
    readonly type: AstType;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstReceiverSimple = {
    readonly kind: "simple";
    readonly param: AstTypedParameter;
    readonly id: number;
};

export type AstReceiverFallback = {
    readonly kind: "fallback";
    readonly id: number;
};

export type AstReceiverComment = {
    readonly kind: "comment";
    readonly comment: AstString;
    readonly id: number;
};

export type AstReceiverSubKind =
    | AstReceiverSimple
    | AstReceiverFallback
    | AstReceiverComment;

export type AstReceiverInternal = {
    readonly kind: "internal";
    readonly subKind: AstReceiverSubKind;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstReceiverExternal = {
    readonly kind: "external";
    readonly subKind: AstReceiverSubKind;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstReceiverBounce = {
    readonly kind: "bounce";
    readonly param: AstTypedParameter;
    readonly id: number;
    readonly loc: SrcInfo;
};

export type AstReceiverKind =
    | AstReceiverInternal
    | AstReceiverExternal
    | AstReceiverBounce;

export type AstNode =
    | AstFuncId
    | AstDestructMapping
    | AstDestructEnd
    | AstExpression
    | AstStatement
    | AstTypeDecl
    | AstFieldDecl
    | AstTypedParameter
    | AstFunctionDef
    | AstFunctionAttribute
    | AstAsmFunctionDef
    | AstFunctionDecl
    | AstModule
    | AstNativeFunctionDecl
    | AstStructFieldInitializer
    | AstStructFieldValue
    | AstType
    | AstContractInit
    | AstReceiver
    | AstImport
    | AstConstantDef
    | AstConstantDecl
    | AstReceiverKind
    | AstReceiverSubKind;
