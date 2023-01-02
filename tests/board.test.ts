import { describe, expect, expectTypeOf, test } from 'vitest'
import { findPositionByDiagonalAndPosition } from '../src/utils/board'

describe('findPositionByDiagonalAndPosition works correctly', () => {
  test('is a function', () => {
    expectTypeOf(findPositionByDiagonalAndPosition).toBeFunction()
  })

  test('1x1 board', () => {
    const width = 1
    const height = 1
    const [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 0)
    expect(row).toBe(0)
    expect(col).toBe(0)
  })
  test('2x2 board', () => {
    const width = 2
    const height = 2
    let [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 0)
    expect(row).toBe(0)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 1)
    expect(row).toBe(1)
    expect(col).toBe(1)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 0)
    expect(row).toBe(1)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 1)
    expect(row).toBe(0)
    expect(col).toBe(1)
  })
  test('3x3 board', () => {
    const width = 3
    const height = 3
    let [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 0)
    expect(row).toBe(0)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 1)
    expect(row).toBe(1)
    expect(col).toBe(1)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 2)
    expect(row).toBe(2)
    expect(col).toBe(2)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 0)
    expect(row).toBe(2)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 1)
    expect(row).toBe(1)
    expect(col).toBe(1)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 2)
    expect(row).toBe(0)
    expect(col).toBe(2)
  })
  test('5x4 board', () => {
    const width = 5
    const height = 4
    let [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 0)
    expect(row).toBe(0)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 1)
    expect(row).toBe(1)
    expect(col).toBe(1)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 2)
    expect(row).toBe(2)
    expect(col).toBe(2)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 3)
    expect(row).toBe(3)
    expect(col).toBe(3)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 0)
    expect(row).toBe(0)
    expect(col).toBe(1)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 1)
    expect(row).toBe(1)
    expect(col).toBe(2)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 2)
    expect(row).toBe(2)
    expect(col).toBe(3)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 3)
    expect(row).toBe(3)
    expect(col).toBe(4)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 2, 0)
    expect(row).toBe(3)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 2, 1)
    expect(row).toBe(2)
    expect(col).toBe(1)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 2, 2)
    expect(row).toBe(1)
    expect(col).toBe(2)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 2, 3)
    expect(row).toBe(0)
    expect(col).toBe(3)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 3, 0)
    expect(row).toBe(3)
    expect(col).toBe(1)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 3, 1)
    expect(row).toBe(2)
    expect(col).toBe(2)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 3, 2)
    expect(row).toBe(1)
    expect(col).toBe(3)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 3, 3)
    expect(row).toBe(0)
    expect(col).toBe(4)
  })
  test('4x6 board', () => {
    const width = 4
    const height = 6
    let [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 0)
    expect(row).toBe(0)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 0, 3)
    expect(row).toBe(3)
    expect(col).toBe(3)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 0)
    expect(row).toBe(1)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 1, 3)
    expect(row).toBe(4)
    expect(col).toBe(3)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 2, 0)
    expect(row).toBe(2)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 2, 3)
    expect(row).toBe(5)
    expect(col).toBe(3)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 3, 0)
    expect(row).toBe(3)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 3, 3)
    expect(row).toBe(0)
    expect(col).toBe(3)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 4, 0)
    expect(row).toBe(4)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 4, 3)
    expect(row).toBe(1)
    expect(col).toBe(3)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 5, 0)
    expect(row).toBe(5)
    expect(col).toBe(0)
    ;
    [row, col] = findPositionByDiagonalAndPosition(width, height, 5, 3)
    expect(row).toBe(2)
    expect(col).toBe(3)
  })
})
