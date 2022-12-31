import { IntegerRange, Nullable } from '../utils/types'

const O = 'O'
const X = 'X'
const _ = null
type PlayerO = typeof O
type PlayerX = typeof X
type Empty = typeof _
type NullablePlayerString = PlayerO | PlayerX | Empty
type Player = NullablePlayerString & { __type: 'Player' }

const player = (s: NullablePlayerString): Player => s as Player
const pX = player(X)
const pO = player(O)
const pNull = player(null)

export class BoardState {
  readonly #width: number
  readonly #height: number
  readonly #level: number
  #wonBy: Player
  readonly #children: BoardState[][]
  readonly #parent: Nullable<BoardState>
  #filled: boolean
  readonly #board: Board
  constructor ({ width, height, level, parent = null, board }: { width: number, height: number, level: number, parent?: Nullable<BoardState>, board: Board }) {
    this.#width = width
    this.#height = height
    this.#level = level
    this.#wonBy = player(null)
    this.#children = this.#generateChildStates()
    this.#parent = parent
    this.#filled = false
    this.#board = board
  }

  #generateChildStates (): BoardState[][] {
    if (this.#level > 0) {
      return Array.from(Array(this.#height)).map(_ =>
        Array.from(Array(this.#width)).map(_ =>
          new BoardState({ width: this.#width, height: this.#height, level: this.#level - 1, parent: this, board: this.#board })
        )
      )
    } else {
      return []
    }
  }

  #isWonBy (): Player {
    if (this.#wonBy !== null || this.#level === 0 || this.#filled) {
      return this.#wonBy
    } else {
      const isWonBy = this.#computeIsWonBy()
      if (isWonBy !== null) {
        this.#wonBy = isWonBy
      }
      return isWonBy
    }
  }

  #computeIsWonBy (): Player {
    // Total checks to do: rows + columns + diagonals
    // number of rows: height
    // number of columns: width
    // number of diagonals: min(height, width) * 2 * (1 + abs(height - width))

    // Lookup table for potentially valid checks
    // Each boolean value in these array represents the validity state for each line segment
    const rowChecks = Array<boolean>(this.#height).fill(true)
    const columnChecks = Array<boolean>(this.#width).fill(true)
    const shorterSideLength = Math.min(this.#height, this.#width)
    const sideLengthDiff = Math.abs(this.#height - this.#width)
    const diagonalChecksSize = shorterSideLength * 2 * (1 + sideLengthDiff)
    const diagonalChecks = Array<boolean>(diagonalChecksSize).fill(true)

    const invalidateFromPosition = (row: number, col: number): void => {
      rowChecks[row] = false
      columnChecks[col] = false
      const rightDownDiagonalInvariant = this.#height > this.#width ? row - col : col - row
      const isRightDownDiagonal = rightDownDiagonalInvariant >= 0 && rightDownDiagonalInvariant <= sideLengthDiff
      if (isRightDownDiagonal) {
        diagonalChecks[rightDownDiagonalInvariant] = false
      }
      const rightUpDiagonalInvariant = row + col - shorterSideLength + 1
      const isRightUpDiagonal = rightUpDiagonalInvariant >= 0 && rightUpDiagonalInvariant <= sideLengthDiff
      if (isRightUpDiagonal) {
        diagonalChecks[rightUpDiagonalInvariant + diagonalChecksSize / 2] = false
      }
    }

    // For each position/child, get possible checks to perform and check the validity of those checks
    // while going through each line, invalidate all related(crossing) checks
    // if a line is checked to be invalidated, mark and continue to the next one

    // TODO generalize these 3 cases into one
    // check rows
    for (let row = 0; row < rowChecks.length; row++) {
      const validYet = rowChecks[row]
      if (!validYet) {
        continue
      }
      const rowSize = this.#width
      const firstCellWonBy = this.#children[row][0].#isWonBy()
      if (firstCellWonBy === null) {
        invalidateFromPosition(row, 0)
      } else {
        // check single row
        for (let col = 1; col < rowSize; col++) {
          const cellWonBy = this.#children[row][col].#isWonBy()
          if (cellWonBy === null) {
            invalidateFromPosition(row, col)
            break
          }
          if (cellWonBy !== firstCellWonBy) {
            break
          }
          if (col === rowSize - 1) {
            return firstCellWonBy
          }
        }
      }
    }
    // check columns
    for (let col = 0; col < columnChecks.length; col++) {
      const validYet = columnChecks[col]
      if (!validYet) {
        continue
      }
      const columnSize = this.#height
      const firstCellWonBy = this.#children[0][col].#isWonBy()
      if (firstCellWonBy === null) {
        invalidateFromPosition(0, col)
      } else {
        // check single column
        for (let row = 1; row < columnSize; row++) {
          const cellWonBy = this.#children[row][col].#isWonBy()
          if (cellWonBy === null) {
            invalidateFromPosition(row, col)
            break
          }
          if (cellWonBy !== firstCellWonBy) {
            break
          }
          if (row === columnSize - 1) {
            return firstCellWonBy
          }
        }
      }
    }

    const findPositionByDiagonalAndPosition = (diagonal: number, position: number): [row: number, col: number] => {
      const isRightDownDiagonal = diagonal < diagonalChecksSize / 2
      const startPositionRowAdjustment = isRightDownDiagonal ? 0 : shorterSideLength - 1
      const startPosition: [x: number, y: number] =
        this.#width > this.#height
          ? [startPositionRowAdjustment, diagonal]
          : [startPositionRowAdjustment + diagonal, 0]
      const movementDirection: [x: number, y: number] =
        isRightDownDiagonal ? [1, 1] : [1, -1]
      return [startPosition[0] + position * movementDirection[0], startPosition[1] + position * movementDirection[1]]
    }
    for (let diagonal = 0; diagonal < diagonalChecks.length; diagonal++) {
      const validYet = diagonalChecks[diagonal]
      if (!validYet) {
        continue
      }
      const diagonalSize = shorterSideLength

      const [row, col] = findPositionByDiagonalAndPosition(diagonal, 0)
      const firstCellWonBy = this.#children[row][col].#isWonBy()
      if (firstCellWonBy === null) {
        invalidateFromPosition(row, col)
      } else {
        for (let position = 1; position < diagonalSize; position++) {
          const [row, col] = findPositionByDiagonalAndPosition(diagonal, position)
          const cellWonBy = this.#children[row][col].#isWonBy()
          if (cellWonBy === null) {
            invalidateFromPosition(row, col)
            break
          }
          if (cellWonBy !== firstCellWonBy) {
            break
          }
          if (position === diagonalSize - 1) {
            return firstCellWonBy
          }
        }
      }
    }

    return player(null)
  }

  #canDoMove (): boolean {
    if (this.#wonBy !== null || this.#filled) {
      return false
    } else {
      const canMove = this.#children.some(row => row.some(state => state.#canDoMove()))
      if (!canMove) {
        this.#filled = true
      }
      return canMove
    }
  }

  #canFillHere (): boolean {
    if (this.#level === 0 && this.#wonBy !== null) {
      return this.#canFillParent()
    }
    return false
  }

  #canFillParent (): boolean {
    if (this.#parent === null) {
      return true
    }
    return !this.#parent.#filled && this.#parent.#canFillParent()
  }

  #fill (player: Player): void {
    if (this.#canFillHere()) {
      this.#wonBy = player
      this.#updateAncestorWonBy()
    }
  }

  #updateAncestorWonBy (): void {

  }
}

export class Board {
  readonly width: number
  readonly height: number
  readonly maxLevel: number

  readonly rootState: BoardState

  constructor ({ width = 3, height = 3, maxLevel }: { width?: number, height?: number, maxLevel: IntegerRange<0, 3> }) {
    this.width = width
    this.height = height
    this.maxLevel = maxLevel
    this.rootState = new BoardState({ width, height, level: maxLevel, board: this })
  }

  log (): void {
    console.log(`${this.width}x${this.height}@${this.maxLevel}`)
  }
}
