import { Nullable } from 'vitest'

type Getter<T> = () => T
type Setter<T> = (..._: OptionalSingleTuple<T>) => void
type SingleTuple<T = unknown> = [T]
type OptionalSingleTuple<T = unknown> = SingleTuple<T> | []

export const typeName = (...args: SingleTuple): string => Object.prototype.toString.call(args[0]).slice(8, -1).toLowerCase()

interface ValueHolder<A, V, T extends Nullable<string>> { assigned: A, value: V, type: T }
type AssignedValueHolder<V> = ValueHolder<true, V, string>
type LateValueHolder = ValueHolder<false, undefined, undefined>
type DefaultValueHolder<V> = AssignedValueHolder<V> | LateValueHolder

const getDefaultValue = <T>(holder: DefaultValueHolder<T>): Nullable<T> => {
  return holder.assigned ? holder.value : undefined
}

export const createVariable = <Arg extends OptionalSingleTuple<V>, V>(...args: Arg): [Setter<V>, Getter<Nullable<V>>] => {
  const late = args.length === 0
  const defaultValueHolder: DefaultValueHolder<V> = late
    ? {
        assigned: false,
        value: undefined,
        type: undefined
      }
    : Object.freeze({
      assigned: true,
      value: args[0],
      type: typeName(args[0])
    })

  delete args[0]
  let value = getDefaultValue(defaultValueHolder)

  const setter = (...args: OptionalSingleTuple<V>): void => {
    const reset = args.length === 0
    const b = defaultValueHolder.assigned
    if (reset) {
      if (b) {
        value = getDefaultValue(defaultValueHolder)
      } else {
        throw new TypeError('Cannot reset since default value was not set')
      }
    } else {
      const newValue = args[0]
      const newType = typeName(newValue)
      // ? workaround TSC assuming defaultValue is LateValueHolder
      if (![b][0]) {
        defaultValueHolder.assigned = true
        defaultValueHolder.value = newValue
        defaultValueHolder.type = newType
        Object.freeze(defaultValueHolder)
      }
      const defaultType = (defaultValueHolder as AssignedValueHolder<V>).type
      if (newType === defaultType) {
        value = newValue
      } else {
        throw new TypeError(`Expected new value with type '${defaultType}' but got '${newType}'`)
      }
    }
  }

  const getter = (): Nullable<V> => {
    if (!defaultValueHolder.assigned) {
      throw new Error('Cannot get value since none was ever set')
    }
    return value ?? getDefaultValue(defaultValueHolder)
  }
  return [setter, getter]
}
