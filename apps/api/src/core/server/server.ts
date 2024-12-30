import express from 'express'
import AppRouter from '../routes/routes'
import cors from 'cors'

export const Server = express()
Server.use(express.json())
Server.use(express.urlencoded({ extended: true }))
Server.use(cors())
Server.use(AppRouter)

export default Server
