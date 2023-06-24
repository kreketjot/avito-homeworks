import { FastifyPluginCallback } from 'fastify'
import { AppService } from '../app.service'
import { GetCurrentReq } from '../dto/get-current-req.dto'
import { AuthService } from '../auth/auth.service.client'
import { PutCurrentReq } from '../dto/put-current-req.dto'

export const current: FastifyPluginCallback<{
  appService: AppService
  authServiceClient: AuthService
}> = (instanse, { appService, authServiceClient }, done) => {
  instanse.get('/', async (request, reply) => {
    const username = (request.headers['own-auth-username'] as string) || ''
    console.log({ username })
    const isAuthorized = await authServiceClient.checkAuthorization(username)
    if (isAuthorized) {
      return appService.getCurrent(request.query as GetCurrentReq)
    } else {
      reply.statusCode = 403
      reply.send({
        message: `${username} is not authorized`,
        error: 'Forbidden',
        statusCode: 403,
      })
    }
  })

  instanse.put('/', async (request, reply) => {
    const username = (request.headers['own-auth-username'] as string) || ''
    console.log({ username })
    const isAuthorized = await authServiceClient.checkAuthorization(username)
    if (isAuthorized) {
      return appService.setCurrent(request.query as PutCurrentReq)
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
