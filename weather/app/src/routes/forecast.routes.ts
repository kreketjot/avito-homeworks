import { FastifyPluginCallback } from 'fastify'
import { AppService } from '../app.service'
import { ForecastReq } from '../dto/forecast-req.dto'
import { AuthService } from '../auth/auth.service.client'

export const forecast: FastifyPluginCallback<{
  appService: AppService
  authServiceClient: AuthService
}> = (instanse, { appService, authServiceClient }, done) => {
  instanse.get('/', async (request, reply) => {
    const username = (request.headers['own-auth-username'] as string) || ''
    console.log({ username })
    const isAuthorized = await authServiceClient.checkAuthorization(username)
    if (isAuthorized) {
      return appService.getForecast(request.query as ForecastReq)
    } else {
      reply.statusCode = 403
      reply.send({
        message: `${username} is not authorized`,
        error: 'Not Authorized',
        statusCode: 403,
      })
    }
  })

  done()
}
