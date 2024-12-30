import { UserModel } from '@api/core/database/models/user.model'
import { HandleError } from '@api/core/error/handleError'
import mongoose from 'mongoose'
import { User, UserPatchDtoSchema } from 'todo-types'

export class UserRepository {
  async create(user: User): Promise<string> {
    try {
      const model = new UserModel(user)
      await model.save()
      return model.uuid ?? ''
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        const message: string[] = []
        for (const [, err] of Object.entries(error.errors)) {
          message.push(err.message)
        }
        throw new HandleError('validation_error', message)
      }

      if (error instanceof mongoose.MongooseError) {
        if (error.message === 'email_already_exists') {
          throw new HandleError('validation_error', error.message)
        }
      }
      throw new HandleError('unexpected_error', error)
    }
  }

  async getByUsername(username: string, password?: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: username })
    if (!user) return null
    if (password) {
      const isValid = user.comparePassword(password)
      if (!isValid) return null
    }
    const { uuid, firstName, lastName, email } = user.toObject({ virtuals: true })
    return {
      uuid,
      firstName,
      lastName,
      email
    }
  }

  async getById(uuid: string): Promise<User | null> {
    const user = await UserModel.findOne({ uuid })
    if (!user) return null
    const { firstName, lastName, email } = user.toObject({ virtuals: true })
    return {
      uuid,
      firstName,
      lastName,
      email
    }
  }

  async update(data: UserPatchDtoSchema): Promise<void> {
    const { uuid, ...user } = data
    await UserModel.findOneAndUpdate({ uuid }, user, { new: false })
  }

  async delete(uuid: string): Promise<void> {
    await UserModel.findOneAndDelete({ uuid })
  }
}
