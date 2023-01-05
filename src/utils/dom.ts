import { Undefined } from './types'

export const q = <ExpectedElement extends Element = Element>(queryString: string): Undefined<ExpectedElement> => document.querySelector<ExpectedElement>(queryString)

export const qa = <ExpectedElement extends Element = Element>(queryString: string): ExpectedElement[] => Array.from(document.querySelectorAll<ExpectedElement>(queryString))

type DeregistererFunction = () => void
export const event = (eventTarget: EventTarget, type: string, handler: EventListenerOrEventListenerObject, options: AddEventListenerOptions = {}): DeregistererFunction => {
  const abortController = new AbortController()
  eventTarget.addEventListener(type, handler, { passive: true, signal: abortController.signal, ...options })
  return () => {
    abortController.abort()
  }
}
