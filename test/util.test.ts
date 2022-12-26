import { test, expect, describe, expectTypeOf } from 'vitest'
import { createVariable, typeName } from '../src/util'

describe('typeName works correctly', () => {
  test('typeName is function', () => {
    expectTypeOf(typeName).toBeFunction()
  })

  test('typeName for number values', () => {
    const number = 'number'
    const values = [0, -0, 1, 33, Number.MAX_VALUE, Number.MIN_VALUE, Number.EPSILON, Number.MAX_SAFE_INTEGER, Infinity, -Infinity, NaN, -NaN, Math.PI]
    for (const value of values) {
      expectTypeOf(value).toBeNumber()
    }
    for (const value of values) {
      expect(typeName(value)).toBe(number)
    }
  })

  test('typeName for boolean values', () => {
    const boolean = 'boolean'
    const values = [true, false]
    for (const value of values) {
      expectTypeOf(value).toBeBoolean()
    }
    for (const value of values) {
      expect(typeName(value)).toBe(boolean)
    }
  })

  test('typeName for array values', () => {
    const array = 'array'
    const values = [[]]
    for (const value of values) {
      expectTypeOf(value).toBeArray()
    }
    for (const value of values) {
      expect(typeName(value)).toBe(array)
    }
  })

  test('typeName for object values', () => {
    const object = 'object'
    const values = [{}]
    for (const value of values) {
      expectTypeOf(value).toBeObject()
    }
    for (const value of values) {
      expect(typeName(value)).toBe(object)
    }
  })

  test('typeName for symbol', () => {
    const symbol = 'symbol'
    const values = [Symbol.toStringTag, Symbol.for('symbol')]
    for (const value of values) {
      expectTypeOf(value).toBeSymbol()
    }
    for (const value of values) {
      expect(typeName(value)).toBe(symbol)
    }
  })

  test('typeName for undefined', () => {
    const undef = 'undefined'
    const value = undefined
    expectTypeOf(value).toBeUndefined()
    expect(typeName(value)).toBe(undef)
  })

  test('typeName for null', () => {
    const nul = 'null'
    const value = null
    expectTypeOf(value).toBeNull()
    expect(typeName(value)).toBe(nul)
  })

  test('typeName for date', () => {
    const date = 'date'
    const values = [new Date()]
    for (const value of values) {
      expect(typeName(value)).toBe(date)
    }
  })

  test('typeName for functions', () => {
    const func = 'function'
    const value = (..._: any[]): any => { /* dummy for test */ }
    expectTypeOf(value).toBeFunction()
    expect(typeName(value)).toBe(func)
  })

  test('typeName for string', () => {
    const string = 'string'
    const values = ['', 'hello world']
    for (const value of values) {
      expectTypeOf(value).toBeString()
    }
    for (const value of values) {
      expect(typeName(value)).toBe(string)
    }
  })
})

describe('createVariable works correctly', () => {
  test('createVariable is function', () => {
    expect(typeof createVariable).toBe('function')
  })

  test('createVariable returns a tuple of setter and getter', () => {
    const emptyVariableAccessors = createVariable()
    expectTypeOf(emptyVariableAccessors).toBeArray()
    expect(emptyVariableAccessors).toHaveLength(2)
    const [setter, getter] = emptyVariableAccessors
    expectTypeOf(setter).toBeFunction()
    expectTypeOf(getter).toBeFunction()
  })

  const [setter, getter] = createVariable()

  test('getting does not work before first setter', () => {
    expect(() => getter()).toThrowError('Cannot get')
  })

  test('resetting does not work before first setter', () => {
    expect(() => setter()).toThrowError('Cannot reset')
  })

  const valueToSet = 123
  expectTypeOf(valueToSet).not.toBeNullable()
  expectTypeOf(valueToSet).not.toBeUndefined()
  test('setter accepts a value and does not return', () => {
    expectTypeOf(setter(valueToSet)).toBeVoid()
  })

  test('getter returns a previously set value', () => {
    expect(getter()).toBe(valueToSet)
  })

  test('setting a new value with different type does not work', () => {
    const anotherTypedValue = false
    expect(typeName(anotherTypedValue)).not.toBe(typeName(valueToSet))
    expect(() => setter(anotherTypedValue)).toThrowError('Expected new value with type')
    expect(getter()).toBe(valueToSet)
  })

  const newValue = 99
  expectTypeOf(newValue).not.toBeNullable()
  expectTypeOf(newValue).not.toBeUndefined()
  test('setting a new value works', () => {
    expectTypeOf(setter(newValue)).toBeVoid()
    expect(getter()).toBe(newValue)
  })

  test('resetting a value works', () => {
    expectTypeOf(setter()).toBeVoid()
    expect(getter()).toBe(valueToSet)
  })

  const defaultValue = 0
  const [setNum, getNum] = createVariable(defaultValue)
  expectTypeOf(defaultValue).not.toBeUndefined()
  test('getting and resetting works immediately when given default value', () => {
    expect(getNum()).toBe(defaultValue)
    expect(() => setNum()).not.toThrow()

    const newValue = 123
    expectTypeOf(setNum(newValue)).toBeVoid()
    expect(getNum()).toBe(newValue)
    expect(() => setNum()).not.toThrow()
    expect(getNum()).toBe(defaultValue)
  })
})
