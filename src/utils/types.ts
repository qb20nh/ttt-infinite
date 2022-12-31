import { N, S } from 'ts-toolbelt'

export type CommonNode = JSX.Element & Node
export const component = (element: JSX.Element): CommonNode => element as CommonNode

type _IntegerRange<From extends number, To extends number, Range = N.Range<From, To>> = Range[keyof Range & number]
export type IntegerRange<From extends number, To extends number> = _IntegerRange<From, To>

type RepeatString<S extends string, N extends number> = RepeatStringAltRec<S, TupleOf<unknown, N>>
type RepeatStringAltRec<S extends string, T extends unknown[]> =
    T['length'] extends 1 ? S : `${S}${RepeatStringAltRec<S, DropFirst<T>>}`

type TupleOf<T, N extends number> = N extends N ? number extends N ? T[] : _TupleOf<T, N, []> : never
type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>
type DropFirst<T extends readonly unknown[]> = T extends readonly [any?, ...infer U] ? U : [...T]

export type RepeatStringNonCross<T extends string, N extends number> = T extends infer A ? A extends string ? RepeatString<A, N> : never : never

export type Nullable<T> = T | null
