import { GameBoard } from './components/game_board'
import { createVariable } from './utils/common'
// eslint-disable-next-line
const appElement = document.querySelector < HTMLDivElement >('#app')!

appElement.append(
  GameBoard as unknown as Node
)

const [setNum, getNum] = createVariable(-1)
