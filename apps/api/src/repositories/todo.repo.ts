import { TodoModel } from '@api/core/database/models/todo.model'
import { HandleError } from '@api/core/error/handleError'
import mongoose, { SortOrder } from 'mongoose'
import { Filter, Todo, TodoPostDtoSchema, TodoPutDtoSchema } from 'todo-types'

export class TodoRepository {
  async create(ownerId: string, data: TodoPostDtoSchema): Promise<Todo> {
    try {
      const todoModel = new TodoModel({
        ...data,
        owner: ownerId
      })
      const todo = await todoModel.save()
      const { uuid, title, description, completed, createdAt } = todo.toObject()
      return {
        uuid,
        title,
        description,
        completed,
        createdAt
      }
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const message: string[] = []
        for (const [, err] of Object.entries(error.errors)) {
          message.push(err.message)
        }
        throw new HandleError('validation_error', message)
      }
      throw new HandleError('unexpected_error', error)
    }
  }

  async getById(ownerId: string, uuid: string): Promise<Todo> {
    try {
      const todo = await TodoModel.findOne({ uuid })
      if (!todo) throw new HandleError('todo_not_found', uuid)
      const { title, description, completed, createdAt } = todo.toObject({ virtuals: true })
      return {
        uuid,
        title,
        description,
        completed,
        createdAt
      }
    } catch (error) {
      if (error instanceof HandleError) throw error
      if (error instanceof mongoose.Error.ValidationError) {
        const message: string[] = []
        for (const [, err] of Object.entries(error.errors)) {
          message.push(err.message)
        }
        throw new HandleError('validation_error', message)
      }
      throw new HandleError('unexpected_error', error)
    }
  }

  async getByOwnerId(ownerId: string, filter: Filter): Promise<{ total: number; todos: Todo[] }> {
    try {
      const { limit = 0, offset = 20, sort = 'createdAt_desc', query, completed } = filter
      let queryFilter = {}
      if (query) {
        queryFilter = {
          $or: [{ title: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }]
        }
      }

      if (`${completed ?? ''}`) {
        queryFilter = {
          ...queryFilter,
          completed: completed === 'true' || completed === true
        }
      }

      const [sortField, sortOrder] = sort.split('_') as [string, SortOrder]
      if (!['createdAt', 'title', 'completed'].includes(sortField)) {
        throw new HandleError('invalid_sort', { sort, sortField, sortOrder })
      }
      if (!['desc', 'asc'].includes(sortOrder.toString())) {
        throw new HandleError('invalid_sort', { sort, sortField, sortOrder })
      }

      const todos = await TodoModel.find(
        { owner: ownerId, ...queryFilter },
        {
          _id: 0,
          uuid: 1,
          title: 1,
          description: 1,
          createdAt: 1,
          completed: 1
        }
      )
        .sort({ [sortField]: sortOrder })
        .skip(offset)
        .limit(limit)
      const total = await TodoModel.countDocuments({ owner: ownerId, ...queryFilter })

      return {
        todos,
        total
      }
    } catch (error) {
      if (error instanceof HandleError) throw error
      if (error instanceof mongoose.Error.ValidationError) {
        const message: string[] = []
        for (const [, err] of Object.entries(error.errors)) {
          message.push(err.message)
        }
        throw new HandleError('validation_error', message)
      }
      throw new HandleError('unexpected_error', error)
    }
  }

  async update(ownerId: string, data: TodoPutDtoSchema): Promise<void> {
    try {
      const { uuid, ...todo } = data
      await TodoModel.findOneAndUpdate({ uuid, owner: ownerId }, todo, { new: false })
    } catch (error) {
      if (error instanceof HandleError) throw error
      if (error instanceof mongoose.Error.ValidationError) {
        const message: string[] = []
        for (const [, err] of Object.entries(error.errors)) {
          message.push(err.message)
        }
        throw new HandleError('validation_error', message)
      }
      throw new HandleError('unexpected_error', error)
    }
  }

  async delete(ownerId: string, uuid: string): Promise<void> {
    try {
      await TodoModel.findOneAndDelete({ uuid })
    } catch (error) {
      if (error instanceof HandleError) throw error
      if (error instanceof mongoose.Error.ValidationError) {
        const message: string[] = []
        for (const [, err] of Object.entries(error.errors)) {
          message.push(err.message)
        }
        throw new HandleError('validation_error', message)
      }
      throw new HandleError('unexpected_error', error)
    }
  }

  async deleteByOwnerId(ownerId: string): Promise<void> {
    try {
      await TodoModel.deleteMany({ owner: ownerId })
    } catch (error) {
      if (error instanceof HandleError) throw error
      if (error instanceof mongoose.Error.ValidationError) {
        const message: string[] = []
        for (const [, err] of Object.entries(error.errors)) {
          message.push(err.message)
        }
        throw new HandleError('validation_error', message)
      }
      throw new HandleError('unexpected_error', error)
    }
  }
}
export default TodoRepository
