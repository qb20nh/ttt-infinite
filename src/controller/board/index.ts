import { createModelSchema, identifier, primitive, object, reference, list } from 'serializr'
import { Board } from './board'
import { BoardState } from './boardState'

export * from './board'
export * from './boardState'

createModelSchema(Board, {
  id: identifier(),
  width: primitive(),
  height: primitive(),
  maxLevel: primitive(),
  rootState: object(BoardState),
  activeState: reference(BoardState),
  turn: primitive()
})

createModelSchema(BoardState, {
  id: identifier(),
  level: primitive(),
  children: list(list(object(BoardState))),
  parent: reference(BoardState),
  board: reference(Board),
  __wonBy: primitive(),
  __filled: primitive()
})
