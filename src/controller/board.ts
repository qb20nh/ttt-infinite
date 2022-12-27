import { N } from 'ts-toolbelt'

type DefaultMaxRange = N.Range<1, 3>
type LevelRange = DefaultMaxRange[keyof DefaultMaxRange & number]

export class BoardState {
  move (): void {
    console.log('boardState move')
  }
}

export class Board {
  #width: number
  #height: number
  #maxLevel: number

  #state: BoardState

  constructor ({ width = 3, height = 3, maxLevel }: { width: number, height: number, maxLevel: LevelRange }) {
    this.#width = width
    this.#height = height
    this.#maxLevel = maxLevel
    this.#state = new BoardState()
  }

  move (): void {
    this.#state.move()
  }

  log (): void {
    console.log(`${this.#width}x${this.#height}@${this.#maxLevel}`)
  }
}
