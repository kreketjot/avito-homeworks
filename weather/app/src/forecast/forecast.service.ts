import axios from 'axios'
import { formatISO, isBefore, parseISO } from 'date-fns'
import {
  ForecastCurrentResponse,
  ForecastFutureResponse,
} from './forecast.types'
import { Coords } from '../app.types'
import redis from '../redis'
import { stringifyCoords } from '../geo/geo.utils'

const TEN_MINUTES = 10 * 60

export class ForecastService {
  private readonly URL: string

  constructor() {
    const url = process.env.METEO_URL
    if (url === undefined) {
      throw 'METEO_URL is undefined'
    }
    this.URL = url
  }

  async getTemperature(coords: Coords, datetime?: Date): Promise<number> {
    console.log(`Get temperature: ${JSON.stringify({ coords, datetime })}`)

    const cacheKey = `forecast:${stringifyCoords(coords)}${
      datetime !== undefined ? `:${datetime}` : ''
    }`
    const cachedValue = await redis.get(cacheKey)
    if (cachedValue !== null) {
      console.log('return cached value', cacheKey, cachedValue)
      return +cachedValue
    }

    const temperaturePromise =
      datetime !== undefined
        ? this.fetchFutureForecast(coords, datetime)
        : this.fetchCurrentForecast(coords)

    return temperaturePromise.then((temperature) => {
      console.log('store temperature in cache', cacheKey, temperature)
      redis.set(cacheKey, temperature, { EX: TEN_MINUTES })
      return temperature
    })
  }

  async setTemperature(
    coords: Coords,
    temperature: number,
    datetime?: Date,
  ): Promise<boolean> {
    console.log(
      `Set temperature: ${JSON.stringify({ coords, temperature, datetime })}`,
    )

    const cacheKey = `forecast:${stringifyCoords(coords)}${
      datetime !== undefined ? `:${datetime}` : ''
    }`

    console.log('store temperature in cache', cacheKey, temperature)
    return redis
      .set(cacheKey, temperature, { EX: TEN_MINUTES })
      .then(() => true)
      .catch(() => false)
  }

  private async fetchCurrentForecast(coords: Coords): Promise<number> {
    const temperature = axios
      .get<ForecastCurrentResponse>(this.URL, {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          current_weather: true,
        },
      })
      .then((res) => res.data)
      .then((data) => data.current_weather.temperature)
      .catch((error) => {
        console.error(error)
        throw 'An error occurred while getting temperature by coords'
      })

    return temperature
  }

  private async fetchFutureForecast(
    coords: Coords,
    datetime: Date,
  ): Promise<number> {
    const requestedDate = formatISO(datetime, {
      representation: 'date',
    })
    const temperature = axios
      .get<ForecastFutureResponse>(this.URL, {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          start_date: requestedDate,
          end_date: requestedDate,
          hourly: 'temperature_2m',
        },
      })
      .then((res) => res.data)
      .then((data) =>
        this.mapFutureForecastResponseToTemperature(data, datetime),
      )
      .catch((error) => {
        console.error(error)
        throw 'An error occurred while getting temperature by coords'
      })

    return temperature
  }

  private mapFutureForecastResponseToTemperature(
    res: ForecastFutureResponse,
    requestedDate: Date,
  ): number {
    const index = res.hourly.time
      .map((datetime) => parseISO(datetime))
      .findIndex((datetime) => isBefore(datetime, requestedDate))
    return res.hourly.temperature_2m[index]
  }
}
