import { Nullable } from 'vitest'
import { IntegerRange } from '../utils/types'

const O = 'O'
const X = 'X'
const _ = null
type PlayerO = typeof O
type PlayerX = typeof X
type Empty = typeof _
type NullablePlayerString = PlayerO | PlayerX | Empty
type Player = NullablePlayerString & { __type: 'Player' }

const player = (s: NullablePlayerString): Player => s as Player

export class BoardState {
  readonly #width: number
  readonly #height: number
  readonly #level: number
  #wonBy: Player
  readonly #children: BoardState[][]
  readonly #parent: Nullable<BoardState>
  #filled: boolean
  constructor ({ width, height, level, parent = null }: { width: number, height: number, level: number, parent?: Nullable<BoardState> }) {
    this.#width = width
    this.#height = height
    this.#level = level
    this.#wonBy = player(null)
    this.#children = this.#generateChildStates()
    this.#parent = parent
    this.#filled = false
  }

  #generateChildStates (): BoardState[][] {
    if (this.#level > 0) {
      return Array.from(Array(this.#height)).map(row =>
        Array.from(Array(this.#width)).map(col =>
          new BoardState({ width: this.#width, height: this.#height, level: this.#level - 1, parent: this })
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
    const basePlayer = O
    // Total checks to do: rows + columns + diagonals
    // number of rows: height
    // number of columns: width
    // number of diagonals: min(height, width) * 2 * (1 + abs(height - width))

    // Lookup table for potentially valid checks
    // Each boolean value in these array represents the validity state for each line segment
    const rowChecks = Array<boolean>(this.#height).fill(true)
    const columnChecks = Array<boolean>(this.#width).fill(true)
    const diagonalChecksSize = Math.min(this.#height, this.#width) * 2 * (1 + Math.abs(this.#height - this.#width))
    const diagonalChecks = Array<boolean>(diagonalChecksSize).fill(true)

    // For each position/child, get possible checks to perform and check the validity of those checks
    // while going through each line, invalidate all related(crossing) checks
    // if a line is checked to be invalidated, mark and continue to the next one
    for (const validYet of rowChecks) {
      // check one row
    }
    for (const validYet of columnChecks) {
      // check one column
    }
    for (const validYet of diagonalChecks) {
      // check one diagonal
    }
    // TODO remove this
    return player(null)
  }

  #canDoMove (): boolean {
    if (this.#wonBy !== null || this.#filled) {
      return false
    } else {
      const filled = this.#children.some(row => row.some(state => state.#canDoMove()))
      if (!filled) {
        this.#filled = true
      }
      return filled
    }
  }
}

export class Board {
  readonly #width: number
  readonly #height: number
  readonly #maxLevel: number

  readonly #rootState: BoardState

  constructor ({ width = 3, height = 3, maxLevel }: { width?: number, height?: number, maxLevel: IntegerRange<0, 3> }) {
    this.#width = width
    this.#height = height
    this.#maxLevel = maxLevel
    this.#rootState = new BoardState({ width, height, level: maxLevel })
  }

  log (): void {
    console.log(`${this.#width}x${this.#height}@${this.#maxLevel}`)
  }
}
