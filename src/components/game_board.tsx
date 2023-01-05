import { Board, BoardRenderer } from '@/controller/board/'
import { player } from '@/controller/types'
import { q } from '@/utils/dom'
import { CommonElement, component, Nullable } from '@/utils/types'
import { compressToUTF16, decompressFromUTF16 } from 'lz-string'
import { deserialize, serialize } from 'serializr'

const gameState = {
  board: new Board(3, 3, 3),
  currentTurn: 0,
  currentLevel: 0
}

const renderer = new BoardRenderer()

const key = 'savedData'

const load = (): Nullable<Board> => {
  const savedDataCompressed = localStorage.getItem(key)
  if (savedDataCompressed === null) return null
  const savedData = decompressFromUTF16(savedDataCompressed)
  if (savedData === null) return null
  const parsed = JSON.parse(savedData)
  const loadedGameState = deserialize(Board, parsed as Board)
  return loadedGameState
}

const save = (state: Board): void => {
  const pojo = serialize(state)
  const stringified = JSON.stringify(pojo)
  const compressed = compressToUTF16(stringified)
  localStorage.setItem(key, compressed)
}

gameState.board.startTurn(player.o)

const loaded = load()
if (loaded != null) {
  gameState.board = loaded
} else {
  gameState.board.startTurn(player.o)
}

renderer.setRenderObject(gameState.board)

const id = 'board'

const boardElement = (
  <div id={id}>
    {
     (function draw () {
       gameState.board.setRenderCallback(() => {
         q<HTMLDivElement>(`#${id}`)?.replaceChildren(draw())
         save(gameState.board)
       })
       return renderer.render<CommonElement>()
     }())
}
  </div>
)

export const GameBoard = component(
  <div>
    <h1>
      TTT Infinite
    </h1>

    <style>
      {`
        *, *:before, *:after {
          box-sizing: border-box;
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
        .cell.active .cell:empty {
          cursor: pointer;
        }
        .cell.active .cell:empty:before {
          --bg: #ff8;
        }
        .cell.won.O:empty:before {
          --bg: #f88;
        }
        .cell.won.X:empty:before {
          --bg: #88f;
        }
        `}
    </style>
    {
      boardElement
    }
  </div>
)
