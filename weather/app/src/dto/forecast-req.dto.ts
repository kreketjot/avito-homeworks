import { BaseReq } from './base-req';

export type ForecastReq = BaseReq & {
  dt: string;
};
