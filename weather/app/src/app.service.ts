import { parseISO } from 'date-fns'
import { GeoService } from './geo/geo.service'
import { ForecastService } from './forecast/forecast.service'
import { GetCurrentReq } from './dto/get-current-req.dto'
import { GetCurrentRes } from './dto/get-current-res.dto'
import { GetForecastReq } from './dto/get-forecast-req.dto'
import { GetForecastRes } from './dto/get-forecast-res.dto'
import { PutCurrentReq } from './dto/put-current-req.dto'
import { PutCurrentRes } from './dto/put-current-res.dto'

export class AppService {
  constructor(
    private readonly geoService: GeoService,
    private readonly forecastService: ForecastService,
  ) {
    this.geoService = geoService
    this.forecastService = forecastService
  }

  async getCurrent(dto: GetCurrentReq): Promise<GetCurrentRes> {
    if (dto.city === undefined) {
      throw 'Missing "city" query parameter'
    }

    const coords = await this.geoService.getCoords(dto.city)
    const temperature = await this.forecastService.getTemperature(coords)
    return {
      city: dto.city,
      unit: 'celsius',
      temperature,
    }
  }

  async getForecast(dto: GetForecastReq): Promise<GetForecastRes> {
    if (dto.city === undefined) {
      throw 'Missing "city" query parameter'
    }
    if (dto.dt === undefined) {
      throw 'Missing "dt" query parameter'
    }

    const coords = await this.geoService.getCoords(dto.city)
    const datetime = parseISO(dto.dt)
    const temperature = await this.forecastService.getTemperature(
      coords,
      datetime,
    )
    return {
      city: dto.city,
      unit: 'celsius',
      temperature,
    }
  }

  async setCurrent(dto: PutCurrentReq): Promise<PutCurrentRes> {
    if (dto.city === undefined) {
      throw 'Missing "city" query parameter'
    }
    if (dto.temperature === undefined) {
      throw 'Missing "temperature" query parameter'
    }

    const coords = await this.geoService.getCoords(dto.city)
    const hasCached = await this.forecastService.setTemperature(
      coords,
      dto.temperature,
    )
    return {
      ok: hasCached,
    }
  }
}
