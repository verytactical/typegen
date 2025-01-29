// Generated. Do not edit!
import * as $ from "../ast.ts";
export type Left<L> = $.Left<L>;
export const Left = <L,>(left: L): $.Left<L> => Object.freeze({
  kind: "left",
  left
});
export const isLeft = <L,>($value: Left<L>) => $value.kind === "left";
export type Right<R> = $.Right<R>;
export const Right = <R,>(right: R): $.Right<R> => Object.freeze({
  kind: "right",
  right
});
export const isRight = <R,>($value: Right<R>) => $value.kind === "right";
export type Either<L, R> = $.Either<L, R>;
export type ItemOrigin = $.ItemOrigin;
export const allItemOrigin: readonly $.ItemOrigin[] = ["stdlib", "user"];
export type Address = $.Address;
export type Cell = $.Cell;
export type Slice = $.Slice;
export type SrcInfo = $.SrcInfo;
export const SrcInfo = (origin: $.ItemOrigin, source: string, start: string, end: string): $.SrcInfo => Object.freeze({
  origin,
  source,
  start,
  end
});
export type AstString = $.AstString;
export const AstString = (value: string, id: number, loc: $.SrcInfo): $.AstString => Object.freeze({
  kind: "string",
  value,
  id,
  loc
});
export const isAstString = ($value: AstString) => $value.kind === "string";
export type AstImport = $.AstImport;
export const AstImport = (path: $.AstString, id: number, loc: $.SrcInfo): $.AstImport => Object.freeze({
  kind: "import",
  path,
  id,
  loc
});
export const isAstImport = ($value: AstImport) => $value.kind === "import";
export type AstId = $.AstId;
export const AstId = (text: string, id: number, loc: $.SrcInfo): $.AstId => Object.freeze({
  kind: "id",
  text,
  id,
  loc
});
export const isAstId = ($value: AstId) => $value.kind === "id";
export type AstPrimitiveTypeDecl = $.AstPrimitiveTypeDecl;
export const AstPrimitiveTypeDecl = (name: $.AstId, id: number, loc: $.SrcInfo): $.AstPrimitiveTypeDecl => Object.freeze({
  kind: "primitive_type_decl",
  name,
  id,
  loc
});
export const isAstPrimitiveTypeDecl = ($value: AstPrimitiveTypeDecl) => $value.kind === "primitive_type_decl";
export type AstBinaryOperation = $.AstBinaryOperation;
export const allAstBinaryOperation: readonly $.AstBinaryOperation[] = ["+", "-", "*", "/", "!=", ">", "<", ">=", "<=", "==", "&&", "||", "%", "<<", ">>", "&", "|", "^"];
export type AstUnaryOperation = $.AstUnaryOperation;
export const allAstUnaryOperation: readonly $.AstUnaryOperation[] = ["+", "-", "!", "!!", "~"];
export type AstNumber = $.AstNumber;
export const AstNumber = (base: number, value: bigint, id: number, loc: $.SrcInfo): $.AstNumber => Object.freeze({
  kind: "number",
  base,
  value,
  id,
  loc
});
export const isAstNumber = ($value: AstNumber) => $value.kind === "number";
export type AstBoolean = $.AstBoolean;
export const AstBoolean = (value: boolean, id: number, loc: $.SrcInfo): $.AstBoolean => Object.freeze({
  kind: "boolean",
  value,
  id,
  loc
});
export const isAstBoolean = ($value: AstBoolean) => $value.kind === "boolean";
export type AstNull = $.AstNull;
export const AstNull = (id: number, loc: $.SrcInfo): $.AstNull => Object.freeze({
  kind: "null",
  id,
  loc
});
export const isAstNull = ($value: AstNull) => $value.kind === "null";
export type AstSimplifiedString = $.AstSimplifiedString;
export const AstSimplifiedString = (value: string, id: number, loc: $.SrcInfo): $.AstSimplifiedString => Object.freeze({
  kind: "simplified_string",
  value,
  id,
  loc
});
export const isAstSimplifiedString = ($value: AstSimplifiedString) => $value.kind === "simplified_string";
export type AstAddress = $.AstAddress;
export const AstAddress = (value: $.Address, id: number, loc: $.SrcInfo): $.AstAddress => Object.freeze({
  kind: "address",
  value,
  id,
  loc
});
export const isAstAddress = ($value: AstAddress) => $value.kind === "address";
export type AstCell = $.AstCell;
export const AstCell = (value: $.Cell, id: number, loc: $.SrcInfo): $.AstCell => Object.freeze({
  kind: "cell",
  value,
  id,
  loc
});
export const isAstCell = ($value: AstCell) => $value.kind === "cell";
export type AstSlice = $.AstSlice;
export const AstSlice = (value: $.Slice, id: number, loc: $.SrcInfo): $.AstSlice => Object.freeze({
  kind: "slice",
  value,
  id,
  loc
});
export const isAstSlice = ($value: AstSlice) => $value.kind === "slice";
export type AstCommentValue = $.AstCommentValue;
export const AstCommentValue = (value: string, id: number, loc: $.SrcInfo): $.AstCommentValue => Object.freeze({
  kind: "comment_value",
  value,
  id,
  loc
});
export const isAstCommentValue = ($value: AstCommentValue) => $value.kind === "comment_value";
export type AstStructFieldValue = $.AstStructFieldValue;
export const AstStructFieldValue = (field: $.AstId, initializer: $.AstLiteral, id: number, loc: $.SrcInfo): $.AstStructFieldValue => Object.freeze({
  kind: "struct_field_value",
  field,
  initializer,
  id,
  loc
});
export const isAstStructFieldValue = ($value: AstStructFieldValue) => $value.kind === "struct_field_value";
export type AstStructValue = $.AstStructValue;
export const AstStructValue = (type_: $.AstId, args: readonly $.AstStructFieldValue[], id: number, loc: $.SrcInfo): $.AstStructValue => Object.freeze({
  kind: "struct_value",
  type: type_,
  args,
  id,
  loc
});
export const isAstStructValue = ($value: AstStructValue) => $value.kind === "struct_value";
export type AstLiteral = $.AstLiteral;
export type AstLiteralExpression = $.AstLiteralExpression;
export const AstLiteralExpression = (value: $.AstLiteral): $.AstLiteralExpression => Object.freeze({
  kind: "literal_expression",
  value
});
export const isAstLiteralExpression = ($value: AstLiteralExpression) => $value.kind === "literal_expression";
export type AstInitOf = $.AstInitOf;
export const AstInitOf = (contract: $.AstId, args: readonly $.AstExpression[], id: number, loc: $.SrcInfo): $.AstInitOf => Object.freeze({
  kind: "init_of",
  contract,
  args,
  id,
  loc
});
export const isAstInitOf = ($value: AstInitOf) => $value.kind === "init_of";
export type AstStructFieldInitializer = $.AstStructFieldInitializer;
export const AstStructFieldInitializer = (field: $.AstId, initializer: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStructFieldInitializer => Object.freeze({
  kind: "struct_field_initializer",
  field,
  initializer,
  id,
  loc
});
export const isAstStructFieldInitializer = ($value: AstStructFieldInitializer) => $value.kind === "struct_field_initializer";
export type AstStructInstance = $.AstStructInstance;
export const AstStructInstance = (type_: $.AstId, args: readonly $.AstStructFieldInitializer[], id: number, loc: $.SrcInfo): $.AstStructInstance => Object.freeze({
  kind: "struct_instance",
  type: type_,
  args,
  id,
  loc
});
export const isAstStructInstance = ($value: AstStructInstance) => $value.kind === "struct_instance";
export type AstStaticCall = $.AstStaticCall;
export const AstStaticCall = (function_: $.AstId, args: readonly $.AstExpression[], id: number, loc: $.SrcInfo): $.AstStaticCall => Object.freeze({
  kind: "static_call",
  function: function_,
  args,
  id,
  loc
});
export const isAstStaticCall = ($value: AstStaticCall) => $value.kind === "static_call";
export type AstFieldAccess = $.AstFieldAccess;
export const AstFieldAccess = (aggregate: $.AstExpression, field: $.AstId, id: number, loc: $.SrcInfo): $.AstFieldAccess => Object.freeze({
  kind: "field_access",
  aggregate,
  field,
  id,
  loc
});
export const isAstFieldAccess = ($value: AstFieldAccess) => $value.kind === "field_access";
export type AstMethodCall = $.AstMethodCall;
export const AstMethodCall = (self: $.AstExpression, method: $.AstId, args: readonly $.AstExpression[], id: number, loc: $.SrcInfo): $.AstMethodCall => Object.freeze({
  kind: "method_call",
  self,
  method,
  args,
  id,
  loc
});
export const isAstMethodCall = ($value: AstMethodCall) => $value.kind === "method_call";
export type AstConditional = $.AstConditional;
export const AstConditional = (condition: $.AstExpression, thenBranch: $.AstExpression, elseBranch: $.AstExpression, id: number, loc: $.SrcInfo): $.AstConditional => Object.freeze({
  kind: "conditional",
  condition,
  thenBranch,
  elseBranch,
  id,
  loc
});
export const isAstConditional = ($value: AstConditional) => $value.kind === "conditional";
export type AstOpUnary = $.AstOpUnary;
export const AstOpUnary = (op: $.AstUnaryOperation, operand: $.AstExpression, id: number, loc: $.SrcInfo): $.AstOpUnary => Object.freeze({
  kind: "op_unary",
  op,
  operand,
  id,
  loc
});
export const isAstOpUnary = ($value: AstOpUnary) => $value.kind === "op_unary";
export type AstOpBinary = $.AstOpBinary;
export const AstOpBinary = (op: $.AstBinaryOperation, left: $.AstExpression, right: $.AstExpression, id: number, loc: $.SrcInfo): $.AstOpBinary => Object.freeze({
  kind: "op_binary",
  op,
  left,
  right,
  id,
  loc
});
export const isAstOpBinary = ($value: AstOpBinary) => $value.kind === "op_binary";
export type AstExpression = $.AstExpression;
export type AstFunctionAttributeGet = $.AstFunctionAttributeGet;
export const AstFunctionAttributeGet = (methodId: $.AstExpression | undefined, loc: $.SrcInfo): $.AstFunctionAttributeGet => Object.freeze({
  kind: "function_attribute",
  type: "get",
  methodId,
  loc
});
export const isAstFunctionAttributeGet = ($value: AstFunctionAttributeGet) => $value.kind === "function_attribute";
export type AstFunctionAttributeName = $.AstFunctionAttributeName;
export const allAstFunctionAttributeName: readonly $.AstFunctionAttributeName[] = ["mutates", "extends", "virtual", "abstract", "override", "inline"];
export type AstFunctionAttributeRest = $.AstFunctionAttributeRest;
export const AstFunctionAttributeRest = (type_: $.AstFunctionAttributeName, loc: $.SrcInfo): $.AstFunctionAttributeRest => Object.freeze({
  kind: "function_attribute",
  type: type_,
  loc
});
export const isAstFunctionAttributeRest = ($value: AstFunctionAttributeRest) => $value.kind === "function_attribute";
export type AstFunctionAttribute = $.AstFunctionAttribute;
export type AstTypeId = $.AstTypeId;
export const AstTypeId = (text: string, id: number, loc: $.SrcInfo): $.AstTypeId => Object.freeze({
  kind: "type_id",
  text,
  id,
  loc
});
export const isAstTypeId = ($value: AstTypeId) => $value.kind === "type_id";
export type AstMapType = $.AstMapType;
export const AstMapType = (keyType: $.AstTypeId, keyStorageType: $.AstId | undefined, valueType: $.AstTypeId, valueStorageType: $.AstId | undefined, id: number, loc: $.SrcInfo): $.AstMapType => Object.freeze({
  kind: "map_type",
  keyType,
  keyStorageType,
  valueType,
  valueStorageType,
  id,
  loc
});
export const isAstMapType = ($value: AstMapType) => $value.kind === "map_type";
export type AstBouncedMessageType = $.AstBouncedMessageType;
export const AstBouncedMessageType = (messageType: $.AstTypeId, id: number, loc: $.SrcInfo): $.AstBouncedMessageType => Object.freeze({
  kind: "bounced_message_type",
  messageType,
  id,
  loc
});
export const isAstBouncedMessageType = ($value: AstBouncedMessageType) => $value.kind === "bounced_message_type";
export type AstOptionalType = $.AstOptionalType;
export const AstOptionalType = (typeArg: $.AstType, id: number, loc: $.SrcInfo): $.AstOptionalType => Object.freeze({
  kind: "optional_type",
  typeArg,
  id,
  loc
});
export const isAstOptionalType = ($value: AstOptionalType) => $value.kind === "optional_type";
export type AstType = $.AstType;
export type AstTypedParameter = $.AstTypedParameter;
export const AstTypedParameter = (name: $.AstId, type_: $.AstType, id: number, loc: $.SrcInfo): $.AstTypedParameter => Object.freeze({
  kind: "typed_parameter",
  name,
  type: type_,
  id,
  loc
});
export const isAstTypedParameter = ($value: AstTypedParameter) => $value.kind === "typed_parameter";
export type AstStatementLet = $.AstStatementLet;
export const AstStatementLet = (name: $.AstId, type_: $.AstType | undefined, expression: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStatementLet => Object.freeze({
  kind: "statement_let",
  name,
  type: type_,
  expression,
  id,
  loc
});
export const isAstStatementLet = ($value: AstStatementLet) => $value.kind === "statement_let";
export type AstStatementReturn = $.AstStatementReturn;
export const AstStatementReturn = (expression: $.AstExpression | undefined, id: number, loc: $.SrcInfo): $.AstStatementReturn => Object.freeze({
  kind: "statement_return",
  expression,
  id,
  loc
});
export const isAstStatementReturn = ($value: AstStatementReturn) => $value.kind === "statement_return";
export type AstStatementExpression = $.AstStatementExpression;
export const AstStatementExpression = (expression: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStatementExpression => Object.freeze({
  kind: "statement_expression",
  expression,
  id,
  loc
});
export const isAstStatementExpression = ($value: AstStatementExpression) => $value.kind === "statement_expression";
export type AstStatementAssign = $.AstStatementAssign;
export const AstStatementAssign = (path: $.AstExpression, expression: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStatementAssign => Object.freeze({
  kind: "statement_assign",
  path,
  expression,
  id,
  loc
});
export const isAstStatementAssign = ($value: AstStatementAssign) => $value.kind === "statement_assign";
export type AstAugmentedAssignOperation = $.AstAugmentedAssignOperation;
export const allAstAugmentedAssignOperation: readonly $.AstAugmentedAssignOperation[] = ["+", "-", "*", "/", "&&", "||", "%", "|", "<<", ">>", "&", "^"];
export type AstStatementAugmentedAssign = $.AstStatementAugmentedAssign;
export const AstStatementAugmentedAssign = (op: $.AstAugmentedAssignOperation, path: $.AstExpression, expression: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStatementAugmentedAssign => Object.freeze({
  kind: "statement_augmentedassign",
  op,
  path,
  expression,
  id,
  loc
});
export const isAstStatementAugmentedAssign = ($value: AstStatementAugmentedAssign) => $value.kind === "statement_augmentedassign";
export type AstStatementDestruct = $.AstStatementDestruct;
export const AstStatementDestruct = (type_: $.AstTypeId, identifiers: ReadonlyMap<string, readonly [$.AstId, $.AstId]>, ignoreUnspecifiedFields: boolean, expression: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStatementDestruct => Object.freeze({
  kind: "statement_destruct",
  type: type_,
  identifiers,
  ignoreUnspecifiedFields,
  expression,
  id,
  loc
});
export const isAstStatementDestruct = ($value: AstStatementDestruct) => $value.kind === "statement_destruct";
export type AstStatementBlock = $.AstStatementBlock;
export const AstStatementBlock = (statements: readonly $.AstStatement[], id: number, loc: $.SrcInfo): $.AstStatementBlock => Object.freeze({
  kind: "statement_block",
  statements,
  id,
  loc
});
export const isAstStatementBlock = ($value: AstStatementBlock) => $value.kind === "statement_block";
export type AstStatementForEach = $.AstStatementForEach;
export const AstStatementForEach = (keyName: $.AstId, valueName: $.AstId, map: $.AstExpression, statements: readonly $.AstStatement[], id: number, loc: $.SrcInfo): $.AstStatementForEach => Object.freeze({
  kind: "statement_foreach",
  keyName,
  valueName,
  map,
  statements,
  id,
  loc
});
export const isAstStatementForEach = ($value: AstStatementForEach) => $value.kind === "statement_foreach";
export type AstCatchBlock = $.AstCatchBlock;
export const AstCatchBlock = (catchName: $.AstId, catchStatements: readonly $.AstStatement[]): $.AstCatchBlock => Object.freeze({
  catchName,
  catchStatements
});
export type AstStatementTry = $.AstStatementTry;
export const AstStatementTry = (statements: readonly $.AstStatement[], catchBlock: $.AstCatchBlock | undefined, id: number, loc: $.SrcInfo): $.AstStatementTry => Object.freeze({
  kind: "statement_try",
  statements,
  catchBlock,
  id,
  loc
});
export const isAstStatementTry = ($value: AstStatementTry) => $value.kind === "statement_try";
export type AstStatementRepeat = $.AstStatementRepeat;
export const AstStatementRepeat = (iterations: $.AstExpression, statements: readonly $.AstStatement[], id: number, loc: $.SrcInfo): $.AstStatementRepeat => Object.freeze({
  kind: "statement_repeat",
  iterations,
  statements,
  id,
  loc
});
export const isAstStatementRepeat = ($value: AstStatementRepeat) => $value.kind === "statement_repeat";
export type AstStatementUntil = $.AstStatementUntil;
export const AstStatementUntil = (condition: $.AstExpression, statements: readonly $.AstStatement[], id: number, loc: $.SrcInfo): $.AstStatementUntil => Object.freeze({
  kind: "statement_until",
  condition,
  statements,
  id,
  loc
});
export const isAstStatementUntil = ($value: AstStatementUntil) => $value.kind === "statement_until";
export type AstStatementWhile = $.AstStatementWhile;
export const AstStatementWhile = (condition: $.AstExpression, statements: readonly $.AstStatement[], id: number, loc: $.SrcInfo): $.AstStatementWhile => Object.freeze({
  kind: "statement_while",
  condition,
  statements,
  id,
  loc
});
export const isAstStatementWhile = ($value: AstStatementWhile) => $value.kind === "statement_while";
export type AstStatementCondition = $.AstStatementCondition;
export const AstStatementCondition = (condition: $.AstExpression, trueStatements: readonly $.AstStatement[], falseStatements: readonly $.AstStatement[] | undefined, elseif: $.AstStatementCondition | undefined, id: number, loc: $.SrcInfo): $.AstStatementCondition => Object.freeze({
  kind: "statement_condition",
  condition,
  trueStatements,
  falseStatements,
  elseif,
  id,
  loc
});
export const isAstStatementCondition = ($value: AstStatementCondition) => $value.kind === "statement_condition";
export type AstStatement = $.AstStatement;
export type AstFunctionDef = $.AstFunctionDef;
export const AstFunctionDef = (attributes: readonly $.AstFunctionAttribute[], name: $.AstId, return_: $.AstType | undefined, params: readonly $.AstTypedParameter[], statements: readonly $.AstStatement[], id: number, loc: $.SrcInfo): $.AstFunctionDef => Object.freeze({
  kind: "function_def",
  attributes,
  name,
  return: return_,
  params,
  statements,
  id,
  loc
});
export const isAstFunctionDef = ($value: AstFunctionDef) => $value.kind === "function_def";
export type AstAsmShuffle = $.AstAsmShuffle;
export const AstAsmShuffle = (args: readonly $.AstId[], ret: readonly $.AstNumber[]): $.AstAsmShuffle => Object.freeze({
  args,
  ret
});
export type AstAsmInstruction = $.AstAsmInstruction;
export type AstAsmFunctionDef = $.AstAsmFunctionDef;
export const AstAsmFunctionDef = (shuffle: $.AstAsmShuffle, attributes: readonly $.AstFunctionAttribute[], name: $.AstId, return_: $.AstType | undefined, params: readonly $.AstTypedParameter[], instructions: readonly $.AstAsmInstruction[], id: number, loc: $.SrcInfo): $.AstAsmFunctionDef => Object.freeze({
  kind: "asm_function_def",
  shuffle,
  attributes,
  name,
  return: return_,
  params,
  instructions,
  id,
  loc
});
export const isAstAsmFunctionDef = ($value: AstAsmFunctionDef) => $value.kind === "asm_function_def";
export type AstFuncId = $.AstFuncId;
export const AstFuncId = (text: string, id: number, loc: $.SrcInfo): $.AstFuncId => Object.freeze({
  kind: "func_id",
  text,
  id,
  loc
});
export const isAstFuncId = ($value: AstFuncId) => $value.kind === "func_id";
export type AstNativeFunctionDecl = $.AstNativeFunctionDecl;
export const AstNativeFunctionDecl = (attributes: readonly $.AstFunctionAttribute[], name: $.AstId, nativeName: $.AstFuncId, params: readonly $.AstTypedParameter[], return_: $.AstType | undefined, id: number, loc: $.SrcInfo): $.AstNativeFunctionDecl => Object.freeze({
  kind: "native_function_decl",
  attributes,
  name,
  nativeName,
  params,
  return: return_,
  id,
  loc
});
export const isAstNativeFunctionDecl = ($value: AstNativeFunctionDecl) => $value.kind === "native_function_decl";
export type AstConstantAttributeName = $.AstConstantAttributeName;
export const allAstConstantAttributeName: readonly $.AstConstantAttributeName[] = ["virtual", "override", "abstract"];
export type AstConstantAttribute = $.AstConstantAttribute;
export const AstConstantAttribute = (type_: $.AstConstantAttributeName, loc: $.SrcInfo): $.AstConstantAttribute => Object.freeze({
  type: type_,
  loc
});
export type AstConstantDef = $.AstConstantDef;
export const AstConstantDef = (attributes: readonly $.AstConstantAttribute[], name: $.AstId, type_: $.AstType, initializer: $.AstExpression, id: number, loc: $.SrcInfo): $.AstConstantDef => Object.freeze({
  kind: "constant_def",
  attributes,
  name,
  type: type_,
  initializer,
  id,
  loc
});
export const isAstConstantDef = ($value: AstConstantDef) => $value.kind === "constant_def";
export type AstFieldDecl = $.AstFieldDecl;
export const AstFieldDecl = (name: $.AstId, type_: $.AstType, initializer: $.AstExpression | undefined, as_: $.AstId | undefined, id: number, loc: $.SrcInfo): $.AstFieldDecl => Object.freeze({
  kind: "field_decl",
  name,
  type: type_,
  initializer,
  as: as_,
  id,
  loc
});
export const isAstFieldDecl = ($value: AstFieldDecl) => $value.kind === "field_decl";
export type AstStructDecl = $.AstStructDecl;
export const AstStructDecl = (name: $.AstId, fields: readonly $.AstFieldDecl[], id: number, loc: $.SrcInfo): $.AstStructDecl => Object.freeze({
  kind: "struct_decl",
  name,
  fields,
  id,
  loc
});
export const isAstStructDecl = ($value: AstStructDecl) => $value.kind === "struct_decl";
export type AstMessageDecl = $.AstMessageDecl;
export const AstMessageDecl = (name: $.AstId, opcode: $.AstExpression | undefined, fields: readonly $.AstFieldDecl[], id: number, loc: $.SrcInfo): $.AstMessageDecl => Object.freeze({
  kind: "message_decl",
  name,
  opcode,
  fields,
  id,
  loc
});
export const isAstMessageDecl = ($value: AstMessageDecl) => $value.kind === "message_decl";
export type AstContractAttribute = $.AstContractAttribute;
export const AstContractAttribute = (name: $.AstString, loc: $.SrcInfo): $.AstContractAttribute => Object.freeze({
  type: "interface",
  name,
  loc
});
export type AstContractInit = $.AstContractInit;
export const AstContractInit = (params: readonly $.AstTypedParameter[], statements: readonly $.AstStatement[], id: number, loc: $.SrcInfo): $.AstContractInit => Object.freeze({
  kind: "contract_init",
  params,
  statements,
  id,
  loc
});
export const isAstContractInit = ($value: AstContractInit) => $value.kind === "contract_init";
export type AstReceiverSimple = $.AstReceiverSimple;
export const AstReceiverSimple = (param: $.AstTypedParameter, id: number): $.AstReceiverSimple => Object.freeze({
  kind: "simple",
  param,
  id
});
export const isAstReceiverSimple = ($value: AstReceiverSimple) => $value.kind === "simple";
export type AstReceiverFallback = $.AstReceiverFallback;
export const AstReceiverFallback = (id: number): $.AstReceiverFallback => Object.freeze({
  kind: "fallback",
  id
});
export const isAstReceiverFallback = ($value: AstReceiverFallback) => $value.kind === "fallback";
export type AstReceiverComment = $.AstReceiverComment;
export const AstReceiverComment = (comment: $.AstString, id: number): $.AstReceiverComment => Object.freeze({
  kind: "comment",
  comment,
  id
});
export const isAstReceiverComment = ($value: AstReceiverComment) => $value.kind === "comment";
export type AstReceiverSubKind = $.AstReceiverSubKind;
export type AstReceiverInternal = $.AstReceiverInternal;
export const AstReceiverInternal = (subKind: $.AstReceiverSubKind, id: number, loc: $.SrcInfo): $.AstReceiverInternal => Object.freeze({
  kind: "internal",
  subKind,
  id,
  loc
});
export const isAstReceiverInternal = ($value: AstReceiverInternal) => $value.kind === "internal";
export type AstReceiverExternal = $.AstReceiverExternal;
export const AstReceiverExternal = (subKind: $.AstReceiverSubKind, id: number, loc: $.SrcInfo): $.AstReceiverExternal => Object.freeze({
  kind: "external",
  subKind,
  id,
  loc
});
export const isAstReceiverExternal = ($value: AstReceiverExternal) => $value.kind === "external";
export type AstReceiverBounce = $.AstReceiverBounce;
export const AstReceiverBounce = (param: $.AstTypedParameter, id: number, loc: $.SrcInfo): $.AstReceiverBounce => Object.freeze({
  kind: "bounce",
  param,
  id,
  loc
});
export const isAstReceiverBounce = ($value: AstReceiverBounce) => $value.kind === "bounce";
export type AstReceiverKind = $.AstReceiverKind;
export type AstReceiver = $.AstReceiver;
export const AstReceiver = (selector: $.AstReceiverKind, statements: readonly $.AstStatement[], id: number, loc: $.SrcInfo): $.AstReceiver => Object.freeze({
  kind: "receiver",
  selector,
  statements,
  id,
  loc
});
export const isAstReceiver = ($value: AstReceiver) => $value.kind === "receiver";
export type AstContractDeclaration = $.AstContractDeclaration;
export type AstContract = $.AstContract;
export const AstContract = (name: $.AstId, traits: readonly $.AstId[], attributes: readonly $.AstContractAttribute[], declarations: readonly $.AstContractDeclaration[], id: number, loc: $.SrcInfo): $.AstContract => Object.freeze({
  kind: "contract",
  name,
  traits,
  attributes,
  declarations,
  id,
  loc
});
export const isAstContract = ($value: AstContract) => $value.kind === "contract";
export type AstFunctionDecl = $.AstFunctionDecl;
export const AstFunctionDecl = (attributes: readonly $.AstFunctionAttribute[], name: $.AstId, return_: $.AstType | undefined, params: readonly $.AstTypedParameter[], id: number, loc: $.SrcInfo): $.AstFunctionDecl => Object.freeze({
  kind: "function_decl",
  attributes,
  name,
  return: return_,
  params,
  id,
  loc
});
export const isAstFunctionDecl = ($value: AstFunctionDecl) => $value.kind === "function_decl";
export type AstConstantDecl = $.AstConstantDecl;
export const AstConstantDecl = (attributes: readonly $.AstConstantAttribute[], name: $.AstId, type_: $.AstType, id: number, loc: $.SrcInfo): $.AstConstantDecl => Object.freeze({
  kind: "constant_decl",
  attributes,
  name,
  type: type_,
  id,
  loc
});
export const isAstConstantDecl = ($value: AstConstantDecl) => $value.kind === "constant_decl";
export type AstTraitDeclaration = $.AstTraitDeclaration;
export type AstTrait = $.AstTrait;
export const AstTrait = (name: $.AstId, traits: readonly $.AstId[], attributes: readonly $.AstContractAttribute[], declarations: readonly $.AstTraitDeclaration[], id: number, loc: $.SrcInfo): $.AstTrait => Object.freeze({
  kind: "trait",
  name,
  traits,
  attributes,
  declarations,
  id,
  loc
});
export const isAstTrait = ($value: AstTrait) => $value.kind === "trait";
export type AstModuleItem = $.AstModuleItem;
export type AstModule = $.AstModule;
export const AstModule = (imports: readonly $.AstImport[], items: readonly $.AstModuleItem[], id: number): $.AstModule => Object.freeze({
  kind: "module",
  imports,
  items,
  id
});
export const isAstModule = ($value: AstModule) => $value.kind === "module";
export type AstTypeDecl = $.AstTypeDecl;
export type AstDestructMapping = $.AstDestructMapping;
export const AstDestructMapping = (field: $.AstId, name: $.AstId, id: number, loc: $.SrcInfo): $.AstDestructMapping => Object.freeze({
  kind: "destruct_mapping",
  field,
  name,
  id,
  loc
});
export const isAstDestructMapping = ($value: AstDestructMapping) => $value.kind === "destruct_mapping";
export type AstDestructEnd = $.AstDestructEnd;
export const AstDestructEnd = (ignoreUnspecifiedFields: boolean, id: number, loc: $.SrcInfo): $.AstDestructEnd => Object.freeze({
  kind: "destruct_end",
  ignoreUnspecifiedFields,
  id,
  loc
});
export const isAstDestructEnd = ($value: AstDestructEnd) => $value.kind === "destruct_end";
export type AstNode = $.AstNode;