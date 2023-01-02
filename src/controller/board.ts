import { findPositionByDiagonalAndPosition } from '../utils/board'
import { indexOf } from '../utils/common'
import { event } from '../utils/dom'
import { Nullable } from '../utils/types'

const O = 'O'
const X = 'X'
const Null = null
type PlayerO = typeof O
type PlayerX = typeof X
type Empty = typeof Null
type NullablePlayerString = PlayerO | PlayerX | Empty
type Player = NullablePlayerString & { __type: 'Player' }

export const player = (s: NullablePlayerString): Player => s as Player

player.x = player(X)
player.o = player(O)
player.empty = player(null)
Object.freeze(player)

export class BoardState {
  readonly level: number
  #wonBy: Player
  readonly children: Nullable<BoardState[][]>
  readonly parent: Nullable<BoardState>
  #filled: boolean
  readonly board: Board

  static clone (other: BoardState): BoardState {
    return new BoardState({
      level: other.level,
      parent: other.parent,
      board: other.board
    })
  }

  constructor ({ level, parent = null, board }: { level: number, parent?: Nullable<BoardState>, board: Board }) {
    this.level = level
    this.#wonBy = player.empty
    this.parent = parent
    this.#filled = false
    this.board = board
    this.children = this.#generateChildren()
  }

  get width (): number {
    return this.board.width
  }

  get height (): number {
    return this.board.height
  }

  #generateChildren (): Nullable<BoardState[][]> {
    if (this.level > 0) {
      return Array.from(Array(this.height)).map(_ =>
        Array.from(Array(this.width)).map(_ =>
          new BoardState({ level: this.level - 1, parent: this, board: this.board })
        )
      )
    } else {
      return null
    }
  }

  get isWonBy (): Player {
    if (this.#wonBy !== null || this.level === 0 || this.#filled) {
      return this.#wonBy
    } else {
      return this.#updateIsWonBy(player.empty)
    }
  }

  #updateIsWonBy (placed: Player): Player {
    const previousWonBy = this.#wonBy
    if (previousWonBy === null) {
      const wonBy = this.level === 0 ? placed : this.#computeIsWonBy()
      if (wonBy !== null) {
        this.#wonBy = wonBy
        this.#updateActive()
      }
      return wonBy
    }
    return previousWonBy
  }

  #updateActive (): void {
    if (this.parent !== null) {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const [row, col] = indexOf(this.parent.children!, this)
      if (this.parent.parent !== null) {
        const activeState = this.parent.parent.children![row][col]
        this.board.activeState = activeState
        activeState.#afterUpdateActive()
      }
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
    }
  }

  #afterUpdateActive (): void {
    if (!this.canDoMove) {
      this.board.activeState = null
      if (this.parent !== null) {
        this.board.activeState = this.parent
        this.parent.#afterUpdateActive()
      }
    }
  }

  get isActive (): boolean {
    return this.board.activeState === this
  }

  #computeIsWonBy (): Player {
    if (this.children !== null) {
    // Total checks to do: rows + columns + diagonals
    // number of rows: height
    // number of columns: width
    // number of diagonals: min(height, width) * 2 * (1 + abs(height - width))

      // Lookup table for potentially valid checks
      // Each boolean value in these array represents the validity state for each line segment
      const rowChecks = Array<boolean>(this.height).fill(true)
      const columnChecks = Array<boolean>(this.width).fill(true)
      const shorterSideLength = Math.min(this.height, this.width)
      const sideLengthDiff = Math.abs(this.height - this.width)
      const diagonalChecksSize = 2 * (1 + sideLengthDiff)
      const diagonalChecks = Array<boolean>(diagonalChecksSize).fill(true)

      const invalidateFromPosition = (row: number, col: number): void => {
        rowChecks[row] = false
        columnChecks[col] = false
        const rightDownDiagonalInvariant = this.height > this.width ? row - col : col - row
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
        const rowSize = this.width
        const firstCellWonBy = this.children[row][0].isWonBy
        if (firstCellWonBy === null) {
          invalidateFromPosition(row, 0)
        } else {
        // check single row
          for (let col = 1; col < rowSize; col++) {
            const cellWonBy = this.children[row][col].isWonBy
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
        const columnSize = this.height
        const firstCellWonBy = this.children[0][col].isWonBy
        if (firstCellWonBy === null) {
          invalidateFromPosition(0, col)
        } else {
        // check single column
          for (let row = 1; row < columnSize; row++) {
            const cellWonBy = this.children[row][col].isWonBy
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

      for (let diagonal = 0; diagonal < diagonalChecks.length; diagonal++) {
        const validYet = diagonalChecks[diagonal]
        if (!validYet) {
          continue
        }
        const diagonalSize = shorterSideLength

        const [row, col] = findPositionByDiagonalAndPosition(this.width, this.height, diagonal, 0)
        const firstCellWonBy = this.children[row][col].isWonBy
        if (firstCellWonBy === null) {
          invalidateFromPosition(row, col)
        } else {
          for (let position = 1; position < diagonalSize; position++) {
            const [row, col] = findPositionByDiagonalAndPosition(this.width, this.height, diagonal, position)
            const cellWonBy = this.children[row][col].isWonBy
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
    }

    return this.#wonBy
  }

  #updateFilled (): boolean {
    const canMove = this.children?.some(row => row.some(state => state.canDoMove)) ?? this.#wonBy === null
    if (!canMove) {
      this.#filled = true
    }
    return canMove
  }

  get canDoMove (): boolean {
    if (this.#wonBy !== null || this.#filled) {
      return false
    } else {
      return this.#updateFilled()
    }
  }

  get canFill (): boolean {
    if (this.#wonBy === null && !this.#filled) {
      return this.#parentAllowsFill
    }
    return false
  }

  get #parentAllowsFill (): boolean {
    if (this.parent === null) {
      return !this.#filled
    }
    return this.parent.canDoMove && this.parent.#parentAllowsFill
  }

  fill (): void {
    const player = this.board.turn
    if (player !== null) {
      if (this.canFill && this.hasActiveAncestor) {
        this.#updateAncestorWonBy(player)
        this.board.nextTurn()
      }
    }
  }

  get hasActiveAncestor (): boolean {
    if (this.parent === null) {
      return this.isActive
    }
    return this.isActive || this.parent.hasActiveAncestor
  }

  #updateAncestorWonBy (placed: Player): void {
    this.#updateIsWonBy(placed)
    this.#updateFilled()
    if (this.parent !== null) {
      this.parent.#updateAncestorWonBy(placed)
    }
  }
}

export class Board {
  readonly width: number
  readonly height: number
  readonly maxLevel: number

  readonly rootState: BoardState
  activeState: Nullable<BoardState>
  turn: Player = player.empty

  #renderCallback: Nullable<Function> = null

  constructor ({ width, height, maxLevel }: { width: number, height: number, maxLevel: number }) {
    this.width = width
    this.height = height
    this.maxLevel = maxLevel
    this.rootState = new BoardState({
      level: maxLevel,
      board: this
    })
    this.activeState = this.rootState
  }

  setRenderCallback (fn: Function): void {
    this.#renderCallback = fn
  }

  startTurn (p: Player): void {
    this.turn = p
  }

  nextTurn (): void {
    if (this.turn !== player.empty) {
      this.turn = this.turn === player.o ? player.x : player.o
      this.#renderCallback?.()
    }
  }
}

abstract class ObjectRenderer<T> {
  protected renderObject: T

  constructor (object: T) {
    this.renderObject = object
  }

  abstract render<E extends Element>(): E
}

export class BoardRenderer extends ObjectRenderer<Board> {
  render<E extends Element>(): E {
    const board = this.renderObject
    return this.#renderPartial(board.rootState) as E // ? wtf ?
  }

  #renderPartial (intermediate: BoardState): Element {
    const out = document.createElement('div')
    out.classList.add('cell')
    out.classList.add(`level${intermediate.level}`)
    if (!intermediate.canFill) {
      out.classList.add('filled')
    }
    if (intermediate.isWonBy !== null) {
      out.classList.add('won')
      out.classList.add(intermediate.isWonBy)
    }
    if (intermediate.isActive) {
      out.classList.add('active')
    }
    if (intermediate.level === 0) {
      event(out, 'click', (_) => {
        intermediate.fill()
      })
    }
    if (intermediate.level > 0) {
      out.append(...(intermediate.children?.flatMap(state => state).map(state => this.#renderPartial(state)) ?? []))
    }
    return out
  }
}
