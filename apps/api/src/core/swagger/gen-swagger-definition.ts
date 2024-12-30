import path from 'path'
import fs from 'fs'
import swaggerDocs from 'swagger-jsdoc'
import { getSwaggerOptions } from './swagger'

const swaggerDocument = swaggerDocs(getSwaggerOptions())

fs.writeFile(
  path.resolve(__dirname, '../../../../../', 'dist/apps/api/public/assets/swagger.json'),
  JSON.stringify(swaggerDocument, null, 2),
  () => process.exit(0)
)
