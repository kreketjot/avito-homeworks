import { TemperatureUnit } from './temperature-unit'

export type GetBaseRes = {
  city: string
  unit: TemperatureUnit
  temperature: number
}
