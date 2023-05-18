import { FastifyPluginCallback } from 'fastify'
import { AppService } from '../app.service'
import { CurrentReq } from '../dto/current-req.dto'
import { AuthService } from '../auth/auth.service.client'

export const current: FastifyPluginCallback<{
  appService: AppService
  authServiceClient: AuthService
}> = (instanse, { appService, authServiceClient }, done) => {
  instanse.get('/', async (request, reply) => {
    const username = (request.headers['own-auth-username'] as string) || ''
    console.log({ username })
    const isAuthorized = await authServiceClient.checkAuthorization(username)
    if (isAuthorized) {
      return appService.getCurrent(request.query as CurrentReq)
    } else {
      reply.statusCode = 403
      reply.send({
        message: `${username} is not authorized`,
        error: 'Forbidden',
        statusCode: 403,
      })
    }
  })

  done()
}
