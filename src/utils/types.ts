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

type FilterNonHexChar<S extends string> =
    S extends 'a' | 'b' | 'c' | 'd' | 'e' | 'f' ?
      S :
      S extends `${number}` ?
        S extends `${number}${number}` | `${string}e${string}` | `-${string}` | 'Infinity' | 'NaN' ?
          never :
          S :
        never

type StringToUnion<S extends string> = S.Split<S, ''>[number]

type NonHexChars<S extends string, U = StringToUnion<S>> =
    U extends string ?
      Exclude<U, FilterNonHexChar<U>> :
      never

type HexString<S extends string> =
    NonHexChars<S> extends never ?
      S :
      never

type HexCode<S extends string> =
    S extends `#${infer V}` ?
      V extends string ?
        S.Length<V> extends 6 ?
          HexString<V> extends never ?
            never :
            S :
          never :
        never :
      never

const theme = {
  background: '#012345'
} as const

let v1: HexCode<typeof theme.background> // '#012345'

let v2: HexCode<'012345'> // never (no hash at the beginning)

let v3: HexCode<'#0123456'> // never (too long)

let v4: HexCode<'#01234'> // never (too short)

let v5: HexCode<'#01234z'> // never (contains invalid character)
