// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as global from '@api/global'

import express from 'express'
import path from 'path'
import { SecurityRouter } from './security/security.routes'
import swaggerSetup from '../swagger/swagger'
import { UserRouter } from './user/user.routes'
import AuthenticationMiddleware from '../middlewares/authentication.middleware'
import TodoRouter from './todo/todo.routes'
import { SwaggerController } from '../swagger/swagger.controller'

const publicPath = path.resolve(__dirname, 'public')
const AppRouter = express.Router()
const [docServer, docSetup] = swaggerSetup()

AppRouter.get(SwaggerController.endpoint, SwaggerController)
AppRouter.use('/api-docs/', docServer, docSetup)

AppRouter.use('/api/v1/security/', SecurityRouter)
AppRouter.use('/api/v1/user/', AuthenticationMiddleware, UserRouter)
AppRouter.use('/api/v1/tasks/', AuthenticationMiddleware, TodoRouter)
AppRouter.use('/', express.static(publicPath))

export default AppRouter
