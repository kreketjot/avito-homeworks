import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { CurrentReq } from './dto/current-req.dto';
import { CurrentRes } from './dto/current-res.dto';
import { ForecastReq } from './dto/forecast-req.dto';
import { ForecastRes } from './dto/forecast-res.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('current')
  getCurrent(@Query() query: CurrentReq): Promise<CurrentRes> {
    return this.appService.getCurrent(query);
  }

  @Get('forecast')
  getForecast(@Query() query: ForecastReq): Promise<ForecastRes> {
    return this.appService.getForecast(query);
  }
}
