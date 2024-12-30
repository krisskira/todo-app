import express, { Request, Response } from 'express'
import { HandleError } from '@api/core/error/handleError'
import { UserService } from '@api/services/user/user.service'

export const UserRouter = express.Router()

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user
 *     description: Get user
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user_found
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@example.com
 */
UserRouter.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.context['userId']
    const userService = new UserService()
    const user = await userService.getById(userId)
    res.status(200).send({ message: 'user_found', data: user })
  } catch (error) {
    if (error instanceof HandleError) {
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Get User Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})

/**
 * @swagger
 * /api/v1/user:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user
 *     description: Update user
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
 *       200:
 *         description: User updated
 * */
UserRouter.patch('/', async (req: Request, res: Response) => {
  try {
    const userId = req.context['userId']
    const data = req.body
    const userService = new UserService()
    await userService.update({
      ...data,
      uuid: userId
    })
    res.status(200).send({ message: 'user_updated', data })
  } catch (error) {
    if (error instanceof HandleError) {
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Update User Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})

/**
 * @swagger
 * /api/v1/user:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     description: Delete user
 *     responses:
 *       200:
 *         description: User deleted
 */
UserRouter.delete('/', async (req: Request, res: Response) => {
  try {
    const userId = req.context['userId']
    const userService = new UserService()
    await userService.delete(userId)
    res.status(200).send({ message: 'user_deleted', data: userId })
  } catch (error) {
    if (error instanceof HandleError) {
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Delete User Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})
