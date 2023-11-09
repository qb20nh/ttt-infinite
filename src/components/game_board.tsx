import { Board, BoardRenderer, player } from '../controller/board'
import { q } from '../utils/dom'
import { CommonElement, component } from '../utils/types'

const gameState = {
  board: new Board({ width: 3, height: 3, maxLevel: 3 }),
  currentTurn: 0,
  currentLevel: 0
}

const id = 'board'

const boardElement = (
  <div id={id}>
    {
      (() => {
        gameState.board.startTurn(player.o)
        return (function draw() {
          const renderer = new BoardRenderer(gameState.board)
          gameState.board.setRenderCallback(() => {
            q<HTMLDivElement>(`#${id}`)?.replaceChildren(draw())
          })
          return renderer.render<CommonElement>()
        })()
      })()
    }
  </div>
)

export const GameBoard = component(
  <>
    <h1>
      TTT Infinite
    </h1>

    <style>
      {`
        *, *:before, *:after {
          box-sizing: border-box;
        }

        html {
          height: 100%;
        }
        body {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        h1 {
          position: absolute;
          transform: translate(0, calc(-100% - 1em));
        }

        #board {
          --width: ${gameState.board.width};
          --height: ${gameState.board.height};

          width: 540px;
          aspect-ratio: 1 / 1;
        }
        #board>.cell {
          width: 100%;
          height: 100%;
        }
        .cell {
          border: 1px solid transparent;
        }
        .cell:not(:empty) {
          display: grid;
          grid: repeat(var(--width), 1fr) / repeat(var(--height), 1fr);
        }
        .cell:empty {
          border-width: .5px;
        }
        .cell:empty:before {
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 2px;

          --bg: #e0e0e0;
          background: var(--bg);
        }
        .cell.active :not(.won) .cell:empty,
        .cell.active:not(.won)>.cell:empty {
          cursor: pointer;
        }
        .cell.active :not(.won) .cell:empty:before,
        .cell.active:not(.won)>.cell:empty:before {
          --bg: #ff8;
        }
        .cell.won.O:empty:before {
          --bg: #f88 !important;
        }
        .cell.won.X:empty:before {
          --bg: #88f !important;
        }
        `}
    </style>
    {
      boardElement
    }
  </>
)
