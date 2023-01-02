export const findPositionByDiagonalAndPosition = (width: number, height: number, diagonal: number, position: number): [row: number, col: number] => {
  const shorterSideLength = Math.min(width, height)
  const sideLengthDiff = Math.abs(height - width)
  const diagonalChecksSize = 2 * (1 + sideLengthDiff)
  const isRightDownDiagonal = diagonal < diagonalChecksSize / 2
  const diagonalNumberAdjustment = isRightDownDiagonal ? 0 : -diagonalChecksSize / 2
  const adjustedDiagonal = diagonal + diagonalNumberAdjustment
  const startPositionRowAdjustment = isRightDownDiagonal ? 0 : shorterSideLength - 1
  const startPosition: [x: number, y: number] =
    width > height
      ? [startPositionRowAdjustment, adjustedDiagonal]
      : [startPositionRowAdjustment + adjustedDiagonal, 0]
  const movementDirection: [x: number, y: number] =
    isRightDownDiagonal ? [1, 1] : [-1, 1]
  return [startPosition[0] + position * movementDirection[0], startPosition[1] + position * movementDirection[1]]
}
