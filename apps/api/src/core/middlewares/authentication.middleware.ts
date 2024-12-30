import { SecurityService } from '@api/services/security/register.service'
import { NextFunction, Request, Response } from 'express'
import { HandleError } from '../error/handleError'

const AuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers['authorization']?.split(' ').at(-1)

    if (!token) {
      res.status(401).send({ message: 'unauthorized' })
      return
    }

    const securityService = new SecurityService()
    const result = await securityService.validateToken(token)
    if (!result?.uuid) {
      res.status(401).send({ message: 'unauthorized' })
      return
    }

    req['context'] = { userId: result.uuid }
    next()
  } catch (error) {
    if (error instanceof HandleError) {
      res.status(401).send(error.toJson())
      return
    }
    console.error('>>> Authentication Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
}

export default AuthenticationMiddleware
