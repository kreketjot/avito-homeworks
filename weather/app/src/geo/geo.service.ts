import axios from 'axios'
import { CityResponse } from './geo.types'
import { Coords } from '../app.types'

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

    const coords = axios
      .get<CityResponse[]>(this.URL, {
        params: {
          q: city,
          appid: this.API_KEY,
        },
      })
      .then((res) => res.data)
      .then((data) => this.mapResponseToCoords(data, city))
      .catch((error) => {
        console.error(error)
        throw 'An error occurred while getting coords by city'
      })

    return coords
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
