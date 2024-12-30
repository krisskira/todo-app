import { HandleError } from '@api/core/error/handleError'
import { UserRepository } from '@api/repositories/user.repo'
import { User, UserPatchDtoSchema } from 'todo-types'

export class UserService {
  async getById(uuid: string): Promise<User | null> {
    const userRepo = new UserRepository()
    const user = await userRepo.getById(uuid)
    if (!user) throw new HandleError('user_not_found', { uuid })
    return user
  }

  async update(data: UserPatchDtoSchema): Promise<void> {
    const userRepo = new UserRepository()
    const userExist = userRepo.getByUsername(data.uuid)
    if (!userExist) throw new HandleError('user_not_found', { uuid: data.uuid })
    await userRepo.update(data)
  }

  async delete(uuid: string): Promise<void> {
    const userRepo = new UserRepository()
    const userExist = userRepo.getByUsername(uuid)
    if (!userExist) throw new HandleError('user_not_found', { uuid })
    await userRepo.delete(uuid)
  }
}
