import mongoose from 'mongoose'
import Config from '../config'

export async function databaseBootstrap() {
  try {
    const connection = await mongoose.connect(Config.db.url, {
      dbName: Config.db.name
    })
    connection.connection.once('open', () => console.log('>>> Connected to database'))
    connection.connection.on('error', (e) => console.error('>>> Database connection error:', e))
    console.log('>>> Database connected')
  } catch (error) {
    console.error('>>> Error connecting to database')
    console.error(error)
  }
}

export default databaseBootstrap
