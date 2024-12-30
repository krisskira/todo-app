import { HandleError } from '@api/core/error/handleError'
import { SecurityService } from '@api/services/security/register.service'
import express, { Request, Response } from 'express'

export const SecurityRouter = express.Router()

/**
 * @swagger
 * /api/v1/security/register:
 *   post:
 *     tags:
 *       - Security
 *     summary: Register a new user
 *     security: []
 *     description: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: 12345678
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user_created
 *                 data:
 *                   type: string
 *                   example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user_already_exists
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 *       500:
 *         description: Unexpected error
 */
SecurityRouter.post('/register/', async (req: Request, res: Response) => {
  try {
    const data = req.body
    const securityService = new SecurityService()
    const uuid = await securityService.userRegister(data)
    res.status(201).send({ message: 'user_created', data: uuid })
  } catch (error) {
    if (error instanceof HandleError) {
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Register Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})

/**
 * @swagger
 * /api/v1/security/login:
 *   get:
 *     tags:
 *       - Security
 *     summary: Login a user
 *     description: Login a user
 *     security:
 *       - basicAuth: []
 *     responses:
 *       200:
 *         description: User logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user_logged_in
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: invalid_credentials
 *       500:
 *         description: Unexpected error
 */
SecurityRouter.get('/login/', async (req: Request, res: Response) => {
  try {
    const { authorization } = req.headers
    if (!authorization) throw new HandleError('unauthorized')

    const tokenBase64 = authorization.split(' ').at(-1)
    if (!tokenBase64) throw new HandleError('unauthorized')
    const [email, password] = Buffer.from(tokenBase64, 'base64').toString('ascii').split(':')
    if (!email || !password) throw new HandleError('unauthorized')

    const securityService = new SecurityService()
    const { token } = await securityService.userLogin({ email, password })

    res.status(200).send({ token })
  } catch (error) {
    if (error instanceof HandleError) {
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Login Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})

/**
 * @swagger
 * /api/v1/security/forgot-password:
 *   post:
 *     tags:
 *       - Security
 *     summary: Forgot password
 *     description: Forgot password
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: Password reset
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: password_reset
 *       400:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user_not_found
 *       500:
 *         description: Unexpected error
 */
SecurityRouter.post('/forgot-password/', async (req: Request, res: Response) => {
  try {
    const data = req.body
    const securityService = new SecurityService()
    await securityService.userForgotPassword(data)
    res.status(200).send({ message: 'password_reset' })
  } catch (error) {
    if (error instanceof HandleError) {
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Forgot Password Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})
