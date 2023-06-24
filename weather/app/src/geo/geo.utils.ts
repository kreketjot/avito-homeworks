import { Coords } from '../app.types'

export const stringifyCoords = (coords: Coords): string =>
  JSON.stringify(coords)

export const parseCoords = (coords: string): Coords =>
  JSON.parse(coords) as Coords
