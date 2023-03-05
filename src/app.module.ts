import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GeoModule } from './geo/geo.module';
import { ForecastModule } from './forecast/forecast.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GeoModule,
    ForecastModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
