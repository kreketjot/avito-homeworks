import { Injectable, Logger } from '@nestjs/common';
import { GeoService } from './geo/geo.service';
import { ForecastService } from './forecast/forecast.service';
import { CurrentReq } from './dto/current-req.dto';
import { CurrentRes } from './dto/current-res.dto';
import { ForecastReq } from './dto/forecast-req.dto';
import { ForecastRes } from './dto/forecast-res.dto';
import { parseISO } from 'date-fns';

@Injectable()
export class AppService {
  private readonly logger: Logger = new Logger(AppService.name);
  constructor(
    private readonly geoService: GeoService,
    private readonly forecastService: ForecastService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getCurrent(dto: CurrentReq): Promise<CurrentRes> {
    if (dto.city === undefined) {
      throw 'Missing "city" query parameter';
    }

    const coords = await this.geoService.getCoords(dto.city);
    const temperature = await this.forecastService.getTemperature(coords);
    return {
      city: dto.city,
      unit: 'celsius',
      temperature,
    };
  }

  async getForecast(dto: ForecastReq): Promise<ForecastRes> {
    if (dto.city === undefined) {
      throw 'Missing "city" query parameter';
    }
    if (dto.dt === undefined) {
      throw 'Missing "dt" query parameter';
    }

    const coords = await this.geoService.getCoords(dto.city);
    const datetime = parseISO(dto.dt);
    const temperature = await this.forecastService.getTemperature(
      coords,
      datetime,
    );
    return {
      city: dto.city,
      unit: 'celsius',
      temperature,
    };
  }
}
