import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify'
import * as dotenv from 'dotenv'
import { current } from './routes/current.routes'
import { forecast } from './routes/forecast.routes'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service.client'
import { GeoService } from './geo/geo.service'
import { ForecastService } from './forecast/forecast.service'

dotenv.config()

const { HOST, PORT } = process.env
if (HOST === undefined) {
  throw 'No host'
}
if (PORT === undefined) {
  throw 'No port'
}

const appService = new AppService(new GeoService(), new ForecastService())
const authServiceClient = new AuthService()

const server: FastifyInstance = Fastify({ logger: true })

server.register(current, {
  prefix: '/v1/current',
  appService,
  authServiceClient,
})
server.register(forecast, {
  prefix: '/v1/forecast',
  appService,
  authServiceClient,
})

server.listen({ host: HOST, port: parseInt(PORT) }, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
})
