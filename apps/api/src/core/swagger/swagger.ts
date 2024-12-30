import path from 'path'
import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
import swaggerDocs, { OAS3Options } from 'swagger-jsdoc'
import Config from '../config'

export const getSwaggerOptions = () => {
  return {
    customSiteTitle: 'Task API',
    swaggerDefinition: {
      openapi: '3.0.0',
      security: [{ bearerAuth: [] }],
      components: {
        securitySchemes: {
          basicAuth: {
            type: 'http',
            scheme: 'basic'
          },
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      servers: [
        {
          url: `${Config.app.host}:${Config.app.port}`,
          description: `Server (${Config.app.env})`
        },
        {
          url: 'https://todo-app-quhn.onrender.com/',
          description: `Server (Production)`
        }
      ],
      info: {
        title: 'Task API',
        version: '1.0.0',
        description: 'Test to Coally',
        contact: {
          name: 'Crhistian David Vergara Gomez',
          url: 'https://www.linkedin.com/in/cristian-david-vergara-gomez/',
          email: 'krisskira@gmail.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      tags: [
        {
          name: 'Security',
          description: 'Security operations'
        },
        { name: 'Users', description: 'User operations' },
        {
          name: 'Tasks',
          description: 'To Do operations'
        }
      ]
    },
    apis: [path.resolve(__dirname, '../', 'routes') + '/**/*.ts']
  } as OAS3Options
}

export const swaggerSetup = () => {
  if (Config.app.env === 'production') {
    const filePath = path.resolve(__dirname + '/public/assets/swagger.json')
    console.log('>>> Swagger File: ', filePath)
    const file = fs.readFileSync(filePath)
    const def = JSON.parse(file.toString())
    return [swaggerUi.serve, swaggerUi.setup(def)]
  }

  const swaggerDocument = swaggerDocs(getSwaggerOptions())
  return [swaggerUi.serve, swaggerUi.setup(swaggerDocument)]
}

export default swaggerSetup
