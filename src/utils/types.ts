export type CommonNode = JSX.Element & Node
export const component = (element: JSX.Element): CommonNode => element as CommonNode
