import * as grpc from '@grpc/grpc-js'
import * as dotenv from 'dotenv'
import { AuthServiceClient } from '../proto/AuthService'

export class AuthService {
  private readonly client: AuthServiceClient

  constructor() {
    dotenv.config()

    const { AUTH_PORT } = process.env
    if (AUTH_PORT === undefined) {
      throw 'No auth port'
    }

    this.client = new AuthServiceClient(
      `localhost:${AUTH_PORT}`,
      grpc.credentials.createInsecure(),
    )
  }

  checkAuthorization(user: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const request = {
        name: user,
      }
      this.client.checkAuthorization(request, (error, response) => {
        if (error) {
          console.error(error)
          reject(error)
        }
        resolve(response.isAuthorized)
      })
    })
  }
}
