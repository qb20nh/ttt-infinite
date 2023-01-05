import { id } from '@/utils/common'
import { event } from '@/utils/dom'
import type { Nullable, Undefined } from '@/utils/types'
import { type Player, player } from '@/controller/types'
import { BoardState } from './boardState'

export class Board {
  readonly id: number = id(Board)
  readonly width!: number
  readonly height!: number
  readonly maxLevel!: number
  readonly rootState!: BoardState
  activeState!: Nullable<BoardState>
  turn: Player = player.empty

  #renderCallback: Nullable<Function> = null

  constructor ()
  constructor (width: number, height: number, maxLevel: number)
  constructor (width?: number, height?: number, maxLevel?: number) {
    if (width !== undefined) {
      this.width = width
    }
    if (height !== undefined) {
      this.height = height
    }
    if (maxLevel !== undefined) {
      this.maxLevel = maxLevel
      this.rootState = new BoardState(
        maxLevel,
        null,
        this
      )
      this.activeState = this.rootState
    }
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
  #renderObject: Undefined<T>

  constructor ()
  constructor (renderObject?: T) {
    this.#renderObject = renderObject
  }

  protected getRenderObject (): T {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
    return this.#renderObject!
  }

  setRenderObject (renderObject: T): void {
    this.#renderObject = renderObject
  }

  abstract render<E extends Element>(): E
}

export class BoardRenderer extends ObjectRenderer<Board> {
  render<E extends Element>(): E {
    const board = this.getRenderObject()
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
