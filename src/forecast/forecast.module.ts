import { Module } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [ForecastService],
  exports: [ForecastService],
})
export class ForecastModule {}
