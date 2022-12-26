import { Board } from '../controller/board'
import { component } from '../utils/types'

const gameState = {
  board: new Board(),
  currentTurn: 0,
  currentLevel: 0
}

export const GameBoard = component(
  <h1 onClick={(_) => gameState.board.log()}>
    Hello world
  </h1>
)
