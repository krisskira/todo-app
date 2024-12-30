import TodoRepository from '@api/repositories/todo.repo'
import { Todo, TodoPutDtoSchema, Filter, TodoPostDtoSchema } from 'todo-types'

export class TodoService {
  async create(ownerId: string, data: TodoPostDtoSchema): Promise<Todo> {
    const todoRepository = new TodoRepository()
    return await todoRepository.create(ownerId, data)
  }

  async getById(ownerId: string, uuid: string): Promise<Todo> {
    const todoRepository = new TodoRepository()
    return await todoRepository.getById(ownerId, uuid)
  }

  async getByOwnerId(
    ownerId: string,
    filter: Filter
  ): Promise<{
    total: number
    todos: Todo[]
  }> {
    const todoRepository = new TodoRepository()
    return await todoRepository.getByOwnerId(ownerId, filter)
  }

  async update(ownerId: string, data: TodoPutDtoSchema): Promise<void> {
    const todoRepository = new TodoRepository()
    return await todoRepository.update(ownerId, data)
  }

  async delete(ownerId: string, uuid: string): Promise<void> {
    const todoRepository = new TodoRepository()
    return await todoRepository.delete(ownerId, uuid)
  }

  async deleteAllByOwnerId(ownerId: string): Promise<void> {
    const todoRepository = new TodoRepository()
    return await todoRepository.deleteByOwnerId(ownerId)
  }
}
export default TodoService
