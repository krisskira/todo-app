import Server from './core/server/server'
import { databaseBootstrap } from './core/database/database'
import Config from './core/config'

databaseBootstrap()
Server.listen(Config.app.port, () => console.log(`Server is running on port ${Config.app.port}`))
