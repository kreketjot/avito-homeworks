import { GetBaseReq } from './get-base-req'

export type GetForecastReq = GetBaseReq & {
  dt: string
}
