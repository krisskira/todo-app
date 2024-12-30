import { Request } from 'express'

export declare global {
  namespace Express {
    interface Request {
      context: { userId: string }
    }
  }
}

export interface RequestWithContext extends Request {
  context: { userId: string }
}
