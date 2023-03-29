import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import {
  ForecastCurrentResponse,
  ForecastFutureResponse,
} from './forecast.types';
import { catchError, firstValueFrom, map } from 'rxjs';
import { AxiosError } from 'axios';
import { formatISO, isBefore, parseISO } from 'date-fns';
import { Coords } from 'src/app.types';

@Injectable()
export class ForecastService {
  private readonly logger = new Logger(ForecastService.name);
  private readonly URL: string;

  constructor(private readonly httpService: HttpService) {
    const url = process.env.METEO_URL;
    if (url === undefined) {
      throw 'METEO_URL is undefined';
    }
    this.URL = url;
  }

  async getTemperature(coords: Coords, datetime?: Date): Promise<number> {
    this.logger.log(`Get temperature: ${JSON.stringify({ coords, datetime })}`);

    return datetime !== undefined
      ? this.fetchFutureForecast(coords, datetime)
      : this.fetchCurrentForecast(coords);
  }

  private async fetchCurrentForecast(coords: Coords): Promise<number> {
    const temperature$ = this.httpService
      .get<ForecastCurrentResponse>(this.URL, {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          current_weather: true,
        },
      })
      .pipe(
        map((res) => res.data),
        map((data) => data.current_weather.temperature),
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw 'An error occurred while getting temperature by coords';
        }),
      );

    return firstValueFrom(temperature$);
  }

  private async fetchFutureForecast(
    coords: Coords,
    datetime: Date,
  ): Promise<number> {
    const requestedDate = formatISO(datetime, {
      representation: 'date',
    });
    const temperature$ = this.httpService
      .get<ForecastFutureResponse>(this.URL, {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
          start_date: requestedDate,
          end_date: requestedDate,
          hourly: 'temperature_2m',
        },
      })
      .pipe(
        map((res) => res.data),
        map((data) =>
          this.mapFutureForecastResponseToTemperature(data, datetime),
        ),
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw 'An error occurred while getting temperature by coords';
        }),
      );

    return firstValueFrom(temperature$);
  }

  private mapFutureForecastResponseToTemperature(
    res: ForecastFutureResponse,
    requestedDate: Date,
  ): number {
    const index = res.hourly.time
      .map((datetime) => parseISO(datetime))
      .findIndex((datetime) => isBefore(datetime, requestedDate));
    return res.hourly.temperature_2m[index];
  }
}
