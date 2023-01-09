const O = 'O'
const X = 'X'
const Null = null
type PlayerO = typeof O
type PlayerX = typeof X
type Empty = typeof Null
type NullablePlayerString = PlayerO | PlayerX | Empty
export type Player = NullablePlayerString & { __type: 'Player' }

export const player = (s: NullablePlayerString): Player => s as Player

player.x = player(X)
player.o = player(O)
player.empty = player(null)
Object.freeze(player)
