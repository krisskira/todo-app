import express, { Request, Response } from 'express'
import { HandleError } from '@api/core/error/handleError'
import { TodoService } from '@api/services/todo/todo.service'
import { Filter } from 'todo-types'
import PaginationService from '@api/services/pagination/pagination.service'
import ValidatorMiddleware from '@api/core/middlewares/validations/validator.middleware'
import {
  TodoDeleteValidationsChain,
  TodoFilterValidationsChain,
  TodoGetValidationsChain,
  TodoPatchValidationsChain,
  TodoPostValidationsChain
} from '@api/core/middlewares/validations/chains/todo.chain'

export const TodoRouter = express.Router()

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     tags:
 *       - Tasks
 *     summary: Create todo
 *     description: Create todo
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: title
 *               description:
 *                 type: string
 *                 example: description
 *     responses:
 *       201:
 *         description: Todo created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                   type: string
 *                   example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *                 title:
 *                   type: string
 *                   example: title
 *                 description:
 *                   type: string
 *                   example: description
 *                 createdAt:
 *                   type: string
 *                   example: 2023-01-01T00:00:00.000Z
 *                 completed:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: invalid_todo
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: title
 *                     description:
 *                       type: string
 *                       example: description
 *       500:
 *          description: Unexpedted error
 */
TodoRouter.post('/', ValidatorMiddleware(TodoPostValidationsChain), async (req: Request, res: Response) => {
  try {
    const userId = req.context['userId']
    const { title, description } = req.body
    const todoService = new TodoService()
    const todo = await todoService.create(userId, { title, description })
    res.status(201).json(todo)
  } catch (error) {
    if (error instanceof HandleError) {
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Create Todo Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})

/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get todos
 *     description: Get todos
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         example: Code Review
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         example: true
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - createdAt_desc
 *             - createdAt_asc
 *             - title_desc
 *             - title_asc
 *             - completed_desc
 *             - completed_asc
 *         example: createdAt_desc
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *         example: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         example: 20
 *     responses:
 *       200:
 *         description: Todos found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uuid:
 *                         type: string
 *                         example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *                       title:
 *                         type: string
 *                         example: title
 *                       description:
 *                         type: string
 *                         example: description
 *                       createdAt:
 *                         type: string
 *                         example: 2023-01-01T00:00:00.000Z
 *                       completed:
 *                         type: boolean
 *                         example: true
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 10
 *                     nextOffset:
 *                       type: number
 *                       example: 21
 *                     previousOffset:
 *                       type: number
 *                       example: 19
 *                     nextLimit:
 *                       type: number
 *                       example: 1
 *                     previousLimit:
 *                       type: number
 *                       example: 1
 *       400:
 *         description: Invalid pagination params
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: invalid_pagination_params
 *                 data:
 *                   type: object
 *                   properties:
 *                     totals:
 *                       type: number
 *                       example: 10
 *                     limit:
 *                       type: number
 *                       example: 20
 *                     offset:
 *                       type: number
 *                       example: 20
 *       500:
 *         description: Unexpected error
 */
TodoRouter.get('/', ValidatorMiddleware(TodoFilterValidationsChain), async (req: Request, res: Response) => {
  try {
    const userId = req.context['userId']
    const filters = req.query as Filter
    const { limit = 0, offset = 20 } = filters

    const todoService = new TodoService()
    const todos = await todoService.getByOwnerId(userId, { ...filters, limit: Number(limit), offset: Number(offset) })
    const metadata = PaginationService(todos.total, Number(limit), Number(offset))

    res.status(200).json({
      todos,
      metadata
    })
  } catch (error) {
    if (error instanceof HandleError) {
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Get Todos Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})

/**
 * @swagger
 * /api/v1/tasks/{uuid}:
 *   get:
 *     tags:
 *       - Tasks
 *     summary: Get todo
 *     description: Get todo
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *     responses:
 *       200:
 *         description: Todo found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uuid:
 *                   type: string
 *                   example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *                 title:
 *                   type: string
 *                   example: title
 *                 description:
 *                   type: string
 *                   example: description
 *                 createdAt:
 *                   type: string
 *                   example: 2023-01-01T00:00:00.000Z
 *                 completed:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: todo_not_found
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *       500:
 *          description: Unexpedted error
 */
TodoRouter.get('/:uuid', ValidatorMiddleware(TodoGetValidationsChain), async (req, res) => {
  const { userId } = req.context
  const { uuid } = req.params
  try {
    const todoService = new TodoService()
    const todo = await todoService.getById(userId, uuid)
    if (!todo) {
      const error = new HandleError('todo_not_found', uuid)
      res.status(404).send(error.toJson())
      return
    }
    res.status(200).json(todo)
  } catch (error) {
    if (error instanceof HandleError) {
      if (error.getMessage() === 'todo_not_found') {
        res.status(404).send(error.toJson())
        return
      }
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Get Todo Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})

/**
 * @swagger
 * /api/v1/tasks/{uuid}:
 *   patch:
 *     tags:
 *       - Tasks
 *     summary: Update todo
 *     description: Update todo
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: title
 *               description:
 *                 type: string
 *                 example: description
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Todo updated
 *       400:
 *         description: Invalid todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: todo_not_found
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *       500:
 *          description: Unexpedted error
 */
TodoRouter.patch('/:uuid', ValidatorMiddleware(TodoPatchValidationsChain), async (req, res) => {
  const { userId } = req.context
  const { uuid } = req.params
  try {
    const todoService = new TodoService()
    const data = req.body
    await todoService.update(userId, { uuid, ...data })
    res.status(200).send()
  } catch (error) {
    if (error instanceof HandleError) {
      if (error.getMessage() === 'todo_not_found') {
        res.status(404).send(error.toJson())
        return
      }
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Update Todo Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})

/**
 * @swagger
 * /api/v1/tasks/{uuid}:
 *   delete:
 *     tags:
 *       - Tasks
 *     summary: Delete todo
 *     description: Delete todo
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *     responses:
 *       200:
 *         description: Todo deleted
 *       400:
 *         description: Invalid todo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: todo_not_found
 *                 data:
 *                   type: object
 *                   properties:
 *                     uuid:
 *                       type: string
 *                       example: b2604c91-32e9-4578-a09f-8f2aa24913aa
 *       500:
 *          description: Unexpedted error
 */
TodoRouter.delete('/:uuid', ValidatorMiddleware(TodoDeleteValidationsChain), async (req, res) => {
  const { userId } = req.context
  const { uuid } = req.params
  try {
    const todoService = new TodoService()
    await todoService.delete(userId, uuid)
    res.status(200).send()
  } catch (error) {
    if (error instanceof HandleError) {
      if (error.getMessage() === 'todo_not_found') {
        res.status(404).send(error.toJson())
        return
      }
      res.status(400).send(error.toJson())
      return
    }
    console.error('>>> Delete Todo Error: ', error)
    res.status(500).send({ message: 'unexpected_error', data: {} })
  }
})

export default TodoRouter
