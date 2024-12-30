import dotenv from 'dotenv'
dotenv.config()

export const Config = {
  app: {
    port: Number(process.env['PORT'] || '3000'),
    env: process.env['NODE_ENV'] || 'development',
    host: process.env['HOST'] || 'localhost'
  },
  db: {
    url: process.env['DATABASE_URL'] ?? '',
    name: process.env['DATABASE_NAME'] ?? ''
  },
  auth: {
    secret: process.env['JWT_SECRET'] ?? '',
    expiresIn: process.env['JWT_EXPIRES_IN'] ?? '1d'
  },
  mail: {
    host: process.env['MAIL_HOST'] ?? '',
    port: Number(process.env['MAIL_PORT'] || '25'),
    user: process.env['MAIL_USER'] ?? '',
    pass: process.env['MAIL_PASS'] ?? ''
  }
}

export default Config
