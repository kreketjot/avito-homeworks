import { TemperatureUnit } from './temperature-unit';

export type BaseRes = {
  city: string;
  unit: TemperatureUnit;
  temperature: number;
};
