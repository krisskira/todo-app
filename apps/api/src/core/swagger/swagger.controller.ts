import { NextFunction, Request, Response } from 'express'
import path from 'path'
import Config from '../config'

export const SwaggerController = (req: Request, res: Response, next: NextFunction) => {
  const swaggerPath =
    Config.app.env === 'production'
      ? path.resolve(__dirname, 'public/swagger-ui-dist')
      : path.resolve(__dirname, '../../../../../', 'node_modules', 'swagger-ui-dist')

  const filePath = path.join(swaggerPath, req.path.replace('/api-docs', ''))
  if (filePath.includes('swagger-ui-init.js')) {
    return next()
  }
  console.log('>>> FilePath: ', filePath)
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('Archivo no encontrado')
    }
  })
}

SwaggerController.endpoint = /\/api-docs\/.*\.(css|js|png|ico|json)$/
