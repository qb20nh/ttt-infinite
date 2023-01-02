import { Board, BoardRenderer } from '../controller/board'
import { component } from '../utils/types'

const gameState = {
  board: new Board({ width: 2, height: 2, maxLevel: 3 }),
  currentTurn: 0,
  currentLevel: 0
}

export const GameBoard = component(
  <>
    <h1>
      TTT Infinite
    </h1>
    <div id='board'>
      {
        new BoardRenderer(gameState.board).render() as unknown as JSX.Element | null
      }
    </div>
  </>
)
