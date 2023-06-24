import axios from 'axios'
import { CityResponse } from './geo.types'
import { Coords } from '../app.types'
import redis from '../redis'
import { parseCoords, stringifyCoords } from './geo.utils'

const ONE_WEEK = 7 * 24 * 60 * 60

export class GeoService {
  private readonly URL: string
  private readonly API_KEY: string

  constructor() {
    const url = process.env.GEO_URL
    if (url === undefined) {
      throw 'GEO_URL is undefined'
    }
    this.URL = url

    const api_key = process.env.GEO_API_KEY
    if (api_key === undefined) {
      throw 'GEO_API_KEY is undefined'
    }
    this.API_KEY = api_key
  }

  async getCoords(city: string): Promise<Coords> {
    console.log(`Get coords by city "${city}"`)

    const cacheKey = `geo:${city}`
    const cachedValue = await redis.get(cacheKey)
    if (cachedValue !== null) {
      console.log('return cached value', cacheKey, cachedValue)
      return parseCoords(cachedValue)
    }

    const coordsPromise = axios
      .get<CityResponse[]>(this.URL, {
        params: {
          q: city,
          appid: this.API_KEY,
        },
      })
      .then((res) => res.data)
      .then((data) => this.mapResponseToCoords(data, city))
      .then((coords) => {
        const stringifiedCoords = stringifyCoords(coords)
        console.log('store coords in cache', cacheKey, stringifiedCoords)
        redis.set(cacheKey, stringifiedCoords, { EX: ONE_WEEK })
        return coords
      })
      .catch((error) => {
        console.error(error)
        throw 'An error occurred while getting coords by city'
      })

    return coordsPromise
  }

  private mapResponseToCoords(cities: CityResponse[], city: string): Coords {
    if (cities.length === 0) {
      console.error(`City '${city}' not found`)
      throw 'City not found'
    }

    return {
      latitude: cities[0].lat,
      longitude: cities[0].lon,
    }
  }
}
