import express from 'express'
import AppRouter from '../routes/routes'
import cors from 'cors'
import morgan from 'morgan'
export const Server = express()
Server.use(express.json())
Server.use(express.urlencoded({ extended: true }))
Server.use(cors())
Server.use(morgan('common'))
Server.use(AppRouter)

export default Server
