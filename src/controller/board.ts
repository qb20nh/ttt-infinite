export class Board {
  #width: number
  #height: number
  constructor (width: number = 3, height: number = 3) {
    this.#width = width
    this.#height = height
  }

  log (): void {
    console.log(`${this.#width}x${this.#height}`)
  }
}
