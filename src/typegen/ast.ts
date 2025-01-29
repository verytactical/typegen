export type Location = { readonly start: number; readonly end: number }
export const Location = (start: number, end: number): Location => ({ start, end });

export type TypeDecl = { readonly $: 'TypeDecl'; name: string; type: Type; params: readonly string[]; }
export const TypeDecl = (name: string, type: Type, params: string[]): TypeDecl => ({ $: 'TypeDecl', name, type, params });

export type Type = TypeUndefined | TypeBoolean | TypeNumber | TypeBigint | TypeString | TypeLiteral | TypeArray | TypeTuple | TypeObject | TypeDisjoint | TypeOneOf | TypeRef | TypeMap | TypeSet | TypeMaybe
export type TypeUndefined = { readonly $: 'Undefined', loc: Location }
export const TypeUndefined = (loc: Location): TypeUndefined => ({ $: 'Undefined', loc });
export type TypeBoolean = { readonly $: 'Boolean', loc: Location }
export const TypeBoolean = (loc: Location): TypeBoolean => ({ $: 'Boolean', loc });
export type TypeNumber = { readonly $: 'Number', loc: Location }
export const TypeNumber = (loc: Location): TypeNumber => ({ $: 'Number', loc });
export type TypeBigint = { readonly $: 'Bigint', loc: Location }
export const TypeBigint = (loc: Location): TypeBigint => ({ $: 'Bigint', loc });
export type TypeString = { readonly $: 'String', loc: Location }
export const TypeString = (loc: Location): TypeString => ({ $: 'String', loc });
export type TypeLiteral = { readonly $: 'Literal', value: string, loc: Location }
export const TypeLiteral = (value: string, loc: Location): TypeLiteral => ({ $: 'Literal', value, loc });
export type TypeRef = { readonly $: 'Ref', readonly name: string, readonly params: readonly Type[], loc: Location }
export const TypeRef = (name: string, params: readonly Type[], loc: Location): TypeRef => ({ $: 'Ref', name, params, loc });
export type TypeDisjoint = { readonly $: 'Disjoint', readonly children: readonly TypeRef[], loc: Location }
export const TypeDisjoint = (children: readonly TypeRef[], loc: Location): TypeDisjoint => ({ $: 'Disjoint', children, loc });
export type TypeOneOf = { readonly $: 'OneOf', readonly children: readonly string[], loc: Location }
export const TypeOneOf = (children: readonly string[], loc: Location): TypeOneOf => ({ $: 'OneOf', children, loc });
export type TypeArray = { readonly $: 'Array', readonly child: Type; loc: Location }
export const TypeArray = (child: Type, loc: Location): TypeArray => ({ $: 'Array', child, loc });
export type TypeTuple = { readonly $: 'Tuple', readonly children: readonly Type[], loc: Location }
export const TypeTuple = (children: readonly Type[], loc: Location): TypeTuple => ({ $: 'Tuple', children, loc });
export type TypeObject = { readonly $: 'Object', readonly fields: ReadonlyMap<string, Field>, loc: Location }
export const TypeObject = (fields: ReadonlyMap<string, Field>, loc: Location): TypeObject => ({ $: 'Object', fields, loc });
export type TypeMap = { readonly $: 'Map', readonly key: Type; readonly value: Type, loc: Location }
export const TypeMap = (key: Type, value: Type, loc: Location): TypeMap => ({ $: 'Map', key, value, loc });
export type TypeSet = { readonly $: 'Set', readonly value: Type, loc: Location }
export const TypeSet = (value: Type, loc: Location): TypeSet => ({ $: 'Set', value, loc });
export type TypeMaybe = { readonly $: 'Maybe', readonly value: Type, loc: Location }
export const TypeMaybe = (value: Type, loc: Location): TypeMaybe => ({ $: 'Maybe', value, loc });

export type Field = { readonly name: string; readonly type: Type }
export const Field = (name: string, type: Type): Field => ({ name, type });