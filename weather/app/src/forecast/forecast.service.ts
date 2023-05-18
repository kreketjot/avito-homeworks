import axios from 'axios'
import { formatISO, isBefore, parseISO } from 'date-fns'
import {
  ForecastCurrentResponse,
  ForecastFutureResponse,
} from './forecast.types'
import { Coords } from '../app.types'

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

    return datetime !== undefined
      ? this.fetchFutureForecast(coords, datetime)
      : this.fetchCurrentForecast(coords)
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
