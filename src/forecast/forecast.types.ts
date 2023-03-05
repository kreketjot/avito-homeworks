type ForecastBaseResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
};

export type ForecastFutureResponse = ForecastBaseResponse & {
  hourly_units: HourlyUnits;
  hourly: Hourly;
};

type Hourly = {
  time: string[];
  temperature_2m: number[];
};

type HourlyUnits = {
  time: string;
  temperature_2m: string;
};

export type ForecastCurrentResponse = ForecastBaseResponse & {
  current_weather: CurrentWeather;
};

type CurrentWeather = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
};
