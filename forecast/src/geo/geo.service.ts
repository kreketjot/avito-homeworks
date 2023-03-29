import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { CityResponse } from './geo.types';
import { Coords } from 'src/app.types';

@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);
  private readonly URL: string;
  private readonly API_KEY: string;

  constructor(private readonly httpService: HttpService) {
    const url = process.env.GEO_URL;
    if (url === undefined) {
      throw 'GEO_URL is undefined';
    }
    this.URL = url;

    const api_key = process.env.GEO_API_KEY;
    if (api_key === undefined) {
      throw 'GEO_API_KEY is undefined';
    }
    this.API_KEY = api_key;
  }

  async getCoords(city: string): Promise<Coords> {
    this.logger.log(`Get coords by city "${city}"`);

    const coords$ = this.httpService
      .get<CityResponse[]>(this.URL, {
        params: {
          q: city,
          appid: this.API_KEY,
        },
      })
      .pipe(
        map((res) => res.data),
        map((data) => this.mapResponseToCoords(data, city)),
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw 'An error occurred while getting coords by city';
        }),
      );

    return firstValueFrom(coords$);
  }

  private mapResponseToCoords(cities: CityResponse[], city: string): Coords {
    if (cities.length === 0) {
      this.logger.error(`City '${city}' not found`);
      throw 'City not found';
    }

    return {
      latitude: cities[0].lat,
      longitude: cities[0].lon,
    };
  }
}
