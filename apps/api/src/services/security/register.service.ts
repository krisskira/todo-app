import jsonwebtoken from 'jsonwebtoken'
import crypto from 'crypto'
import {
  ForgotPasswordPostDtoSchema,
  LoginPostDtoSchema,
  LoginResponseDtoSchema,
  RegisterPostDtoSchema
} from 'todo-types'
import { UserRepository } from '@api/repositories/user.repo'
import Config from '@api/core/config'
import { MailService } from '../mail/mail.service'
import { HandleError } from '@api/core/error/handleError'

export class SecurityService {
  async userRegister(data: RegisterPostDtoSchema): Promise<string> {
    const userRepo = new UserRepository()
    const existingUser = await userRepo.getByUsername(data.email)
    if (existingUser) throw new HandleError('user_already_exists', { email: data.email })
    return await userRepo.create(data)
  }

  async userLogin(data: LoginPostDtoSchema): Promise<LoginResponseDtoSchema> {
    const userRepo = new UserRepository()
    const user = await userRepo.getByUsername(data.email, data.password)
    if (!user) throw new HandleError('invalid_credentials')

    const token = jsonwebtoken.sign(
      {
        uuid: user.uuid
      },
      Config.auth.secret,
      { expiresIn: Config.auth.expiresIn }
    )
    return { token }
  }

  async validateToken(token: string): Promise<{ uuid: string }> {
    try {
      return jsonwebtoken.verify(token, Config.auth.secret) as { uuid: string }
    } catch (error) {
      if (error instanceof jsonwebtoken.JsonWebTokenError) throw new HandleError('invalid_token')
      if (error instanceof jsonwebtoken.TokenExpiredError) throw new HandleError('token_expired')
      console.error('>>> Unexpected Token Error: ', error)
      throw new HandleError('unexpected_error', error)
    }
  }

  async userForgotPassword(data: ForgotPasswordPostDtoSchema): Promise<void> {
    const userRepo = new UserRepository()
    const user = await userRepo.getByUsername(data.email)
    if (!user?.uuid) throw new HandleError('user_not_found', { email: data.email })
    const { email, firstName, lastName, uuid } = user

    const newPassword = crypto.randomBytes(8).toString('base64url')
    await userRepo.update({ uuid, password: newPassword })

    const mailService = new MailService()
    await mailService.sendMail(
      email,
      'Password Reset',
      `Hi ${firstName} ${lastName}, you new password is <strong>${newPassword}</strong>`
    )
  }
}
