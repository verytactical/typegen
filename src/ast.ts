export type TypeDecl = { $: 'TypeDecl'; name: string; type: Type; params: string[]; }
export const TypeDecl = (name: string, type: Type, params: string[]): TypeDecl => ({ $: 'TypeDecl', name, type, params });

export type Type = TypeNull | TypeUndefined | TypeBoolean | TypeNumber | TypeBigint | TypeString | TypeLiteral | TypeArray | TypeTuple | TypeObject | TypeUnion | TypeRef
export type TypeNull = { $: 'Null' }
export const TypeNull: TypeNull = { $: 'Null' }
export type TypeUndefined = { $: 'Undefined' }
export const TypeUndefined: TypeUndefined = { $: 'Undefined' }
export type TypeBoolean = { $: 'Boolean' }
export const TypeBoolean: TypeBoolean = { $: 'Boolean' }
export type TypeNumber = { $: 'Number' }
export const TypeNumber: TypeNumber = { $: 'Number' }
export type TypeBigint = { $: 'Bigint' }
export const TypeBigint: TypeBigint = { $: 'Bigint' }
export type TypeString = { $: 'String' }
export const TypeString: TypeString = { $: 'String' }
export type TypeLiteral = { $: 'Literal', value: string }
export const TypeLiteral = (value: string): TypeLiteral => ({ $: 'Literal', value })
export type TypeRef = { $: 'Ref', name: string, params: Type[] }
export const TypeRef = (name: string, params: Type[]): TypeRef => ({ $: 'Ref', name, params })
export type TypeUnion = { $: 'Union', children: Type[] }
export const TypeUnion = (children: Type[]): TypeUnion => ({ $: 'Union', children })
export type TypeArray = { $: 'Array', child: Type; }
export const TypeArray = (child: Type): TypeArray => ({ $: 'Array', child })
export type TypeTuple = { $: 'Tuple', children: Type[] }
export const TypeTuple = (children: Type[]): TypeTuple => ({ $: 'Tuple', children })
export type TypeObject = { $: 'Object', fields: Record<string, Field>; }
export const TypeObject = (fields: Record<string, Field>): TypeObject => ({ $: 'Object', fields })

export type Field = { name: string; type: Type }
export const Field = (name: string, type: Type): Field => ({ name, type });