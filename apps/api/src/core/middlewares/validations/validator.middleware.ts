import { HandleError } from '@api/core/error/handleError'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ContextRunner } from 'express-validator'

export const ValidatorMiddleware = (validations: ContextRunner[]): RequestHandler => {
  const requestHandler: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = []

    for (const validation of validations) {
      const result = await validation.run(req)
      if (!result.isEmpty()) {
        const messages = result.array().map((err) => err.msg)
        errors.push(...messages)
      }
    }

    if (errors.length > 0) {
      const error = new HandleError('validation_error', errors)
      res.status(400).send(error.toJson())
      return
    }

    next()
  }
  return requestHandler
}

export default ValidatorMiddleware
