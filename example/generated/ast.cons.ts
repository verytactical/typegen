import * as $ from "../ast.ts";
export type Left<L> = $.Left<L>;
export const Left = <L,>(left: L): $.Left<L> => ({
  kind: "left",
  left
});
export const isLeft = $value => $value.kind === "left";
export type Right<R> = $.Right<R>;
export const Right = <R,>(right: R): $.Right<R> => ({
  kind: "right",
  right
});
export const isRight = $value => $value.kind === "right";
export type Either<L, R> = $.Either<L, R>;
export type ItemOrigin = $.ItemOrigin;
export const allItemOrigin: $.ItemOrigin[] = ["stdlib", "user"];
export type Address = $.Address;
export type Cell = $.Cell;
export type Slice = $.Slice;
export type SrcInfo = $.SrcInfo;
export const SrcInfo = (origin: $.ItemOrigin, source: string, start: string, end: string): $.SrcInfo => ({
  origin,
  source,
  start,
  end
});
export type AstString = $.AstString;
export const AstString = (value: string, id: number, loc: $.SrcInfo): $.AstString => ({
  kind: "string",
  value,
  id,
  loc
});
export const isAstString = $value => $value.kind === "string";
export type AstImport = $.AstImport;
export const AstImport = (path: $.AstString, id: number, loc: $.SrcInfo): $.AstImport => ({
  kind: "import",
  path,
  id,
  loc
});
export const isAstImport = $value => $value.kind === "import";
export type AstId = $.AstId;
export const AstId = (text: string, id: number, loc: $.SrcInfo): $.AstId => ({
  kind: "id",
  text,
  id,
  loc
});
export const isAstId = $value => $value.kind === "id";
export type AstPrimitiveTypeDecl = $.AstPrimitiveTypeDecl;
export const AstPrimitiveTypeDecl = (name: $.AstId, id: number, loc: $.SrcInfo): $.AstPrimitiveTypeDecl => ({
  kind: "primitive_type_decl",
  name,
  id,
  loc
});
export const isAstPrimitiveTypeDecl = $value => $value.kind === "primitive_type_decl";
export type AstBinaryOperation = $.AstBinaryOperation;
export const allAstBinaryOperation: $.AstBinaryOperation[] = ["+", "-", "*", "/", "!=", ">", "<", ">=", "<=", "==", "&&", "||", "%", "<<", ">>", "&", "|", "^"];
export type AstUnaryOperation = $.AstUnaryOperation;
export const allAstUnaryOperation: $.AstUnaryOperation[] = ["+", "-", "!", "!!", "~"];
export type AstNumber = $.AstNumber;
export const AstNumber = (base: number, value: bigint, id: number, loc: $.SrcInfo): $.AstNumber => ({
  kind: "number",
  base,
  value,
  id,
  loc
});
export const isAstNumber = $value => $value.kind === "number";
export type AstBoolean = $.AstBoolean;
export const AstBoolean = (value: boolean, id: number, loc: $.SrcInfo): $.AstBoolean => ({
  kind: "boolean",
  value,
  id,
  loc
});
export const isAstBoolean = $value => $value.kind === "boolean";
export type AstNull = $.AstNull;
export const AstNull = (id: number, loc: $.SrcInfo): $.AstNull => ({
  kind: "null",
  id,
  loc
});
export const isAstNull = $value => $value.kind === "null";
export type AstSimplifiedString = $.AstSimplifiedString;
export const AstSimplifiedString = (value: string, id: number, loc: $.SrcInfo): $.AstSimplifiedString => ({
  kind: "simplified_string",
  value,
  id,
  loc
});
export const isAstSimplifiedString = $value => $value.kind === "simplified_string";
export type AstAddress = $.AstAddress;
export const AstAddress = (value: $.Address, id: number, loc: $.SrcInfo): $.AstAddress => ({
  kind: "address",
  value,
  id,
  loc
});
export const isAstAddress = $value => $value.kind === "address";
export type AstCell = $.AstCell;
export const AstCell = (value: $.Cell, id: number, loc: $.SrcInfo): $.AstCell => ({
  kind: "cell",
  value,
  id,
  loc
});
export const isAstCell = $value => $value.kind === "cell";
export type AstSlice = $.AstSlice;
export const AstSlice = (value: $.Slice, id: number, loc: $.SrcInfo): $.AstSlice => ({
  kind: "slice",
  value,
  id,
  loc
});
export const isAstSlice = $value => $value.kind === "slice";
export type AstCommentValue = $.AstCommentValue;
export const AstCommentValue = (value: string, id: number, loc: $.SrcInfo): $.AstCommentValue => ({
  kind: "comment_value",
  value,
  id,
  loc
});
export const isAstCommentValue = $value => $value.kind === "comment_value";
export type AstStructFieldValue = $.AstStructFieldValue;
export const AstStructFieldValue = (field: $.AstId, initializer: $.AstLiteral, id: number, loc: $.SrcInfo): $.AstStructFieldValue => ({
  kind: "struct_field_value",
  field,
  initializer,
  id,
  loc
});
export const isAstStructFieldValue = $value => $value.kind === "struct_field_value";
export type AstStructValue = $.AstStructValue;
export const AstStructValue = (type_: $.AstId, args: $.AstStructFieldValue[], id: number, loc: $.SrcInfo): $.AstStructValue => ({
  kind: "struct_value",
  type: type_,
  args,
  id,
  loc
});
export const isAstStructValue = $value => $value.kind === "struct_value";
export type AstLiteral = $.AstLiteral;
export type AstLiteralExpression = $.AstLiteralExpression;
export const AstLiteralExpression = (value: $.AstLiteral): $.AstLiteralExpression => ({
  kind: "literal_expression",
  value
});
export const isAstLiteralExpression = $value => $value.kind === "literal_expression";
export type AstInitOf = $.AstInitOf;
export const AstInitOf = (contract: $.AstId, args: $.AstExpression[], id: number, loc: $.SrcInfo): $.AstInitOf => ({
  kind: "init_of",
  contract,
  args,
  id,
  loc
});
export const isAstInitOf = $value => $value.kind === "init_of";
export type AstStructFieldInitializer = $.AstStructFieldInitializer;
export const AstStructFieldInitializer = (field: $.AstId, initializer: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStructFieldInitializer => ({
  kind: "struct_field_initializer",
  field,
  initializer,
  id,
  loc
});
export const isAstStructFieldInitializer = $value => $value.kind === "struct_field_initializer";
export type AstStructInstance = $.AstStructInstance;
export const AstStructInstance = (type_: $.AstId, args: $.AstStructFieldInitializer[], id: number, loc: $.SrcInfo): $.AstStructInstance => ({
  kind: "struct_instance",
  type: type_,
  args,
  id,
  loc
});
export const isAstStructInstance = $value => $value.kind === "struct_instance";
export type AstStaticCall = $.AstStaticCall;
export const AstStaticCall = (function_: $.AstId, args: $.AstExpression[], id: number, loc: $.SrcInfo): $.AstStaticCall => ({
  kind: "static_call",
  function: function_,
  args,
  id,
  loc
});
export const isAstStaticCall = $value => $value.kind === "static_call";
export type AstFieldAccess = $.AstFieldAccess;
export const AstFieldAccess = (aggregate: $.AstExpression, field: $.AstId, id: number, loc: $.SrcInfo): $.AstFieldAccess => ({
  kind: "field_access",
  aggregate,
  field,
  id,
  loc
});
export const isAstFieldAccess = $value => $value.kind === "field_access";
export type AstMethodCall = $.AstMethodCall;
export const AstMethodCall = (self: $.AstExpression, method: $.AstId, args: $.AstExpression[], id: number, loc: $.SrcInfo): $.AstMethodCall => ({
  kind: "method_call",
  self,
  method,
  args,
  id,
  loc
});
export const isAstMethodCall = $value => $value.kind === "method_call";
export type AstConditional = $.AstConditional;
export const AstConditional = (condition: $.AstExpression, thenBranch: $.AstExpression, elseBranch: $.AstExpression, id: number, loc: $.SrcInfo): $.AstConditional => ({
  kind: "conditional",
  condition,
  thenBranch,
  elseBranch,
  id,
  loc
});
export const isAstConditional = $value => $value.kind === "conditional";
export type AstOpUnary = $.AstOpUnary;
export const AstOpUnary = (op: $.AstUnaryOperation, operand: $.AstExpression, id: number, loc: $.SrcInfo): $.AstOpUnary => ({
  kind: "op_unary",
  op,
  operand,
  id,
  loc
});
export const isAstOpUnary = $value => $value.kind === "op_unary";
export type AstOpBinary = $.AstOpBinary;
export const AstOpBinary = (op: $.AstBinaryOperation, left: $.AstExpression, right: $.AstExpression, id: number, loc: $.SrcInfo): $.AstOpBinary => ({
  kind: "op_binary",
  op,
  left,
  right,
  id,
  loc
});
export const isAstOpBinary = $value => $value.kind === "op_binary";
export type AstExpression = $.AstExpression;
export type AstFunctionAttributeGet = $.AstFunctionAttributeGet;
export const AstFunctionAttributeGet = (methodId: $.AstExpression | undefined, loc: $.SrcInfo): $.AstFunctionAttributeGet => ({
  kind: "function_attribute",
  type: "get",
  methodId,
  loc
});
export const isAstFunctionAttributeGet = $value => $value.kind === "function_attribute";
export type AstFunctionAttributeName = $.AstFunctionAttributeName;
export const allAstFunctionAttributeName: $.AstFunctionAttributeName[] = ["mutates", "extends", "virtual", "abstract", "override", "inline"];
export type AstFunctionAttributeRest = $.AstFunctionAttributeRest;
export const AstFunctionAttributeRest = (type_: $.AstFunctionAttributeName, loc: $.SrcInfo): $.AstFunctionAttributeRest => ({
  kind: "function_attribute",
  type: type_,
  loc
});
export const isAstFunctionAttributeRest = $value => $value.kind === "function_attribute";
export type AstFunctionAttribute = $.AstFunctionAttribute;
export type AstTypeId = $.AstTypeId;
export const AstTypeId = (text: string, id: number, loc: $.SrcInfo): $.AstTypeId => ({
  kind: "type_id",
  text,
  id,
  loc
});
export const isAstTypeId = $value => $value.kind === "type_id";
export type AstMapType = $.AstMapType;
export const AstMapType = (keyType: $.AstTypeId, keyStorageType: $.AstId | undefined, valueType: $.AstTypeId, valueStorageType: $.AstId | undefined, id: number, loc: $.SrcInfo): $.AstMapType => ({
  kind: "map_type",
  keyType,
  keyStorageType,
  valueType,
  valueStorageType,
  id,
  loc
});
export const isAstMapType = $value => $value.kind === "map_type";
export type AstBouncedMessageType = $.AstBouncedMessageType;
export const AstBouncedMessageType = (messageType: $.AstTypeId, id: number, loc: $.SrcInfo): $.AstBouncedMessageType => ({
  kind: "bounced_message_type",
  messageType,
  id,
  loc
});
export const isAstBouncedMessageType = $value => $value.kind === "bounced_message_type";
export type AstOptionalType = $.AstOptionalType;
export const AstOptionalType = (typeArg: $.AstType, id: number, loc: $.SrcInfo): $.AstOptionalType => ({
  kind: "optional_type",
  typeArg,
  id,
  loc
});
export const isAstOptionalType = $value => $value.kind === "optional_type";
export type AstType = $.AstType;
export type AstTypedParameter = $.AstTypedParameter;
export const AstTypedParameter = (name: $.AstId, type_: $.AstType, id: number, loc: $.SrcInfo): $.AstTypedParameter => ({
  kind: "typed_parameter",
  name,
  type: type_,
  id,
  loc
});
export const isAstTypedParameter = $value => $value.kind === "typed_parameter";
export type AstStatementLet = $.AstStatementLet;
export const AstStatementLet = (name: $.AstId, type_: $.AstType | undefined, expression: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStatementLet => ({
  kind: "statement_let",
  name,
  type: type_,
  expression,
  id,
  loc
});
export const isAstStatementLet = $value => $value.kind === "statement_let";
export type AstStatementReturn = $.AstStatementReturn;
export const AstStatementReturn = (expression: $.AstExpression | undefined, id: number, loc: $.SrcInfo): $.AstStatementReturn => ({
  kind: "statement_return",
  expression,
  id,
  loc
});
export const isAstStatementReturn = $value => $value.kind === "statement_return";
export type AstStatementExpression = $.AstStatementExpression;
export const AstStatementExpression = (expression: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStatementExpression => ({
  kind: "statement_expression",
  expression,
  id,
  loc
});
export const isAstStatementExpression = $value => $value.kind === "statement_expression";
export type AstStatementAssign = $.AstStatementAssign;
export const AstStatementAssign = (path: $.AstExpression, expression: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStatementAssign => ({
  kind: "statement_assign",
  path,
  expression,
  id,
  loc
});
export const isAstStatementAssign = $value => $value.kind === "statement_assign";
export type AstAugmentedAssignOperation = $.AstAugmentedAssignOperation;
export const allAstAugmentedAssignOperation: $.AstAugmentedAssignOperation[] = ["+", "-", "*", "/", "&&", "||", "%", "|", "<<", ">>", "&", "^"];
export type AstStatementAugmentedAssign = $.AstStatementAugmentedAssign;
export const AstStatementAugmentedAssign = (op: $.AstAugmentedAssignOperation, path: $.AstExpression, expression: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStatementAugmentedAssign => ({
  kind: "statement_augmentedassign",
  op,
  path,
  expression,
  id,
  loc
});
export const isAstStatementAugmentedAssign = $value => $value.kind === "statement_augmentedassign";
export type AstStatementDestruct = $.AstStatementDestruct;
export const AstStatementDestruct = (type_: $.AstTypeId, identifiers: ReadonlyMap<string, [$.AstId, $.AstId]>, ignoreUnspecifiedFields: boolean, expression: $.AstExpression, id: number, loc: $.SrcInfo): $.AstStatementDestruct => ({
  kind: "statement_destruct",
  type: type_,
  identifiers,
  ignoreUnspecifiedFields,
  expression,
  id,
  loc
});
export const isAstStatementDestruct = $value => $value.kind === "statement_destruct";
export type AstStatementBlock = $.AstStatementBlock;
export const AstStatementBlock = (statements: $.AstStatement[], id: number, loc: $.SrcInfo): $.AstStatementBlock => ({
  kind: "statement_block",
  statements,
  id,
  loc
});
export const isAstStatementBlock = $value => $value.kind === "statement_block";
export type AstStatementForEach = $.AstStatementForEach;
export const AstStatementForEach = (keyName: $.AstId, valueName: $.AstId, map: $.AstExpression, statements: $.AstStatement[], id: number, loc: $.SrcInfo): $.AstStatementForEach => ({
  kind: "statement_foreach",
  keyName,
  valueName,
  map,
  statements,
  id,
  loc
});
export const isAstStatementForEach = $value => $value.kind === "statement_foreach";
export type AstCatchBlock = $.AstCatchBlock;
export const AstCatchBlock = (catchName: $.AstId, catchStatements: $.AstStatement[]): $.AstCatchBlock => ({
  catchName,
  catchStatements
});
export type AstStatementTry = $.AstStatementTry;
export const AstStatementTry = (statements: $.AstStatement[], catchBlock: $.AstCatchBlock | undefined, id: number, loc: $.SrcInfo): $.AstStatementTry => ({
  kind: "statement_try",
  statements,
  catchBlock,
  id,
  loc
});
export const isAstStatementTry = $value => $value.kind === "statement_try";
export type AstStatementRepeat = $.AstStatementRepeat;
export const AstStatementRepeat = (iterations: $.AstExpression, statements: $.AstStatement[], id: number, loc: $.SrcInfo): $.AstStatementRepeat => ({
  kind: "statement_repeat",
  iterations,
  statements,
  id,
  loc
});
export const isAstStatementRepeat = $value => $value.kind === "statement_repeat";
export type AstStatementUntil = $.AstStatementUntil;
export const AstStatementUntil = (condition: $.AstExpression, statements: $.AstStatement[], id: number, loc: $.SrcInfo): $.AstStatementUntil => ({
  kind: "statement_until",
  condition,
  statements,
  id,
  loc
});
export const isAstStatementUntil = $value => $value.kind === "statement_until";
export type AstStatementWhile = $.AstStatementWhile;
export const AstStatementWhile = (condition: $.AstExpression, statements: $.AstStatement[], id: number, loc: $.SrcInfo): $.AstStatementWhile => ({
  kind: "statement_while",
  condition,
  statements,
  id,
  loc
});
export const isAstStatementWhile = $value => $value.kind === "statement_while";
export type AstStatementCondition = $.AstStatementCondition;
export const AstStatementCondition = (condition: $.AstExpression, trueStatements: $.AstStatement[], falseStatements: $.AstStatement[] | undefined, elseif: $.AstStatementCondition | undefined, id: number, loc: $.SrcInfo): $.AstStatementCondition => ({
  kind: "statement_condition",
  condition,
  trueStatements,
  falseStatements,
  elseif,
  id,
  loc
});
export const isAstStatementCondition = $value => $value.kind === "statement_condition";
export type AstStatement = $.AstStatement;
export type AstFunctionDef = $.AstFunctionDef;
export const AstFunctionDef = (attributes: $.AstFunctionAttribute[], name: $.AstId, return_: $.AstType | undefined, params: $.AstTypedParameter[], statements: $.AstStatement[], id: number, loc: $.SrcInfo): $.AstFunctionDef => ({
  kind: "function_def",
  attributes,
  name,
  return: return_,
  params,
  statements,
  id,
  loc
});
export const isAstFunctionDef = $value => $value.kind === "function_def";
export type AstAsmShuffle = $.AstAsmShuffle;
export const AstAsmShuffle = (args: $.AstId[], ret: $.AstNumber[]): $.AstAsmShuffle => ({
  args,
  ret
});
export type AstAsmInstruction = $.AstAsmInstruction;
export type AstAsmFunctionDef = $.AstAsmFunctionDef;
export const AstAsmFunctionDef = (shuffle: $.AstAsmShuffle, attributes: $.AstFunctionAttribute[], name: $.AstId, return_: $.AstType | undefined, params: $.AstTypedParameter[], instructions: $.AstAsmInstruction[], id: number, loc: $.SrcInfo): $.AstAsmFunctionDef => ({
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
export const isAstAsmFunctionDef = $value => $value.kind === "asm_function_def";
export type AstFuncId = $.AstFuncId;
export const AstFuncId = (text: string, id: number, loc: $.SrcInfo): $.AstFuncId => ({
  kind: "func_id",
  text,
  id,
  loc
});
export const isAstFuncId = $value => $value.kind === "func_id";
export type AstNativeFunctionDecl = $.AstNativeFunctionDecl;
export const AstNativeFunctionDecl = (attributes: $.AstFunctionAttribute[], name: $.AstId, nativeName: $.AstFuncId, params: $.AstTypedParameter[], return_: $.AstType | undefined, id: number, loc: $.SrcInfo): $.AstNativeFunctionDecl => ({
  kind: "native_function_decl",
  attributes,
  name,
  nativeName,
  params,
  return: return_,
  id,
  loc
});
export const isAstNativeFunctionDecl = $value => $value.kind === "native_function_decl";
export type AstConstantAttributeName = $.AstConstantAttributeName;
export const allAstConstantAttributeName: $.AstConstantAttributeName[] = ["virtual", "override", "abstract"];
export type AstConstantAttribute = $.AstConstantAttribute;
export const AstConstantAttribute = (type_: $.AstConstantAttributeName, loc: $.SrcInfo): $.AstConstantAttribute => ({
  type: type_,
  loc
});
export type AstConstantDef = $.AstConstantDef;
export const AstConstantDef = (attributes: $.AstConstantAttribute[], name: $.AstId, type_: $.AstType, initializer: $.AstExpression, id: number, loc: $.SrcInfo): $.AstConstantDef => ({
  kind: "constant_def",
  attributes,
  name,
  type: type_,
  initializer,
  id,
  loc
});
export const isAstConstantDef = $value => $value.kind === "constant_def";
export type AstFieldDecl = $.AstFieldDecl;
export const AstFieldDecl = (name: $.AstId, type_: $.AstType, initializer: $.AstExpression | undefined, as_: $.AstId | undefined, id: number, loc: $.SrcInfo): $.AstFieldDecl => ({
  kind: "field_decl",
  name,
  type: type_,
  initializer,
  as: as_,
  id,
  loc
});
export const isAstFieldDecl = $value => $value.kind === "field_decl";
export type AstStructDecl = $.AstStructDecl;
export const AstStructDecl = (name: $.AstId, fields: $.AstFieldDecl[], id: number, loc: $.SrcInfo): $.AstStructDecl => ({
  kind: "struct_decl",
  name,
  fields,
  id,
  loc
});
export const isAstStructDecl = $value => $value.kind === "struct_decl";
export type AstMessageDecl = $.AstMessageDecl;
export const AstMessageDecl = (name: $.AstId, opcode: $.AstExpression | undefined, fields: $.AstFieldDecl[], id: number, loc: $.SrcInfo): $.AstMessageDecl => ({
  kind: "message_decl",
  name,
  opcode,
  fields,
  id,
  loc
});
export const isAstMessageDecl = $value => $value.kind === "message_decl";
export type AstContractAttribute = $.AstContractAttribute;
export const AstContractAttribute = (name: $.AstString, loc: $.SrcInfo): $.AstContractAttribute => ({
  type: "interface",
  name,
  loc
});
export type AstContractInit = $.AstContractInit;
export const AstContractInit = (params: $.AstTypedParameter[], statements: $.AstStatement[], id: number, loc: $.SrcInfo): $.AstContractInit => ({
  kind: "contract_init",
  params,
  statements,
  id,
  loc
});
export const isAstContractInit = $value => $value.kind === "contract_init";
export type AstReceiverSimple = $.AstReceiverSimple;
export const AstReceiverSimple = (param: $.AstTypedParameter, id: number): $.AstReceiverSimple => ({
  kind: "simple",
  param,
  id
});
export const isAstReceiverSimple = $value => $value.kind === "simple";
export type AstReceiverFallback = $.AstReceiverFallback;
export const AstReceiverFallback = (id: number): $.AstReceiverFallback => ({
  kind: "fallback",
  id
});
export const isAstReceiverFallback = $value => $value.kind === "fallback";
export type AstReceiverComment = $.AstReceiverComment;
export const AstReceiverComment = (comment: $.AstString, id: number): $.AstReceiverComment => ({
  kind: "comment",
  comment,
  id
});
export const isAstReceiverComment = $value => $value.kind === "comment";
export type AstReceiverSubKind = $.AstReceiverSubKind;
export type AstReceiverInternal = $.AstReceiverInternal;
export const AstReceiverInternal = (subKind: $.AstReceiverSubKind, id: number, loc: $.SrcInfo): $.AstReceiverInternal => ({
  kind: "internal",
  subKind,
  id,
  loc
});
export const isAstReceiverInternal = $value => $value.kind === "internal";
export type AstReceiverExternal = $.AstReceiverExternal;
export const AstReceiverExternal = (subKind: $.AstReceiverSubKind, id: number, loc: $.SrcInfo): $.AstReceiverExternal => ({
  kind: "external",
  subKind,
  id,
  loc
});
export const isAstReceiverExternal = $value => $value.kind === "external";
export type AstReceiverBounce = $.AstReceiverBounce;
export const AstReceiverBounce = (param: $.AstTypedParameter, id: number, loc: $.SrcInfo): $.AstReceiverBounce => ({
  kind: "bounce",
  param,
  id,
  loc
});
export const isAstReceiverBounce = $value => $value.kind === "bounce";
export type AstReceiverKind = $.AstReceiverKind;
export type AstReceiver = $.AstReceiver;
export const AstReceiver = (selector: $.AstReceiverKind, statements: $.AstStatement[], id: number, loc: $.SrcInfo): $.AstReceiver => ({
  kind: "receiver",
  selector,
  statements,
  id,
  loc
});
export const isAstReceiver = $value => $value.kind === "receiver";
export type AstContractDeclaration = $.AstContractDeclaration;
export type AstContract = $.AstContract;
export const AstContract = (name: $.AstId, traits: $.AstId[], attributes: $.AstContractAttribute[], declarations: $.AstContractDeclaration[], id: number, loc: $.SrcInfo): $.AstContract => ({
  kind: "contract",
  name,
  traits,
  attributes,
  declarations,
  id,
  loc
});
export const isAstContract = $value => $value.kind === "contract";
export type AstFunctionDecl = $.AstFunctionDecl;
export const AstFunctionDecl = (attributes: $.AstFunctionAttribute[], name: $.AstId, return_: $.AstType | undefined, params: $.AstTypedParameter[], id: number, loc: $.SrcInfo): $.AstFunctionDecl => ({
  kind: "function_decl",
  attributes,
  name,
  return: return_,
  params,
  id,
  loc
});
export const isAstFunctionDecl = $value => $value.kind === "function_decl";
export type AstConstantDecl = $.AstConstantDecl;
export const AstConstantDecl = (attributes: $.AstConstantAttribute[], name: $.AstId, type_: $.AstType, id: number, loc: $.SrcInfo): $.AstConstantDecl => ({
  kind: "constant_decl",
  attributes,
  name,
  type: type_,
  id,
  loc
});
export const isAstConstantDecl = $value => $value.kind === "constant_decl";
export type AstTraitDeclaration = $.AstTraitDeclaration;
export type AstTrait = $.AstTrait;
export const AstTrait = (name: $.AstId, traits: $.AstId[], attributes: $.AstContractAttribute[], declarations: $.AstTraitDeclaration[], id: number, loc: $.SrcInfo): $.AstTrait => ({
  kind: "trait",
  name,
  traits,
  attributes,
  declarations,
  id,
  loc
});
export const isAstTrait = $value => $value.kind === "trait";
export type AstModuleItem = $.AstModuleItem;
export type AstModule = $.AstModule;
export const AstModule = (imports: $.AstImport[], items: $.AstModuleItem[], id: number): $.AstModule => ({
  kind: "module",
  imports,
  items,
  id
});
export const isAstModule = $value => $value.kind === "module";
export type AstTypeDecl = $.AstTypeDecl;
export type AstDestructMapping = $.AstDestructMapping;
export const AstDestructMapping = (field: $.AstId, name: $.AstId, id: number, loc: $.SrcInfo): $.AstDestructMapping => ({
  kind: "destruct_mapping",
  field,
  name,
  id,
  loc
});
export const isAstDestructMapping = $value => $value.kind === "destruct_mapping";
export type AstDestructEnd = $.AstDestructEnd;
export const AstDestructEnd = (ignoreUnspecifiedFields: boolean, id: number, loc: $.SrcInfo): $.AstDestructEnd => ({
  kind: "destruct_end",
  ignoreUnspecifiedFields,
  id,
  loc
});
export const isAstDestructEnd = $value => $value.kind === "destruct_end";
export type AstNode = $.AstNode;