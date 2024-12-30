import { MailService } from '../mail/mail.service'
import jsonwebtoken from 'jsonwebtoken'
import crypto from 'crypto'

import { UserRepository } from '../../repositories/user.repo'
import { SecurityService } from './register.service'
import { RegisterPostDtoSchema } from 'todo-types'
import { HandleError } from '../../core/error/handleError'

// Mock de dependencias
jest.mock('jsonwebtoken')
jest.mock('crypto')
jest.mock('../mail/mail.service')
jest.mock('../../repositories/user.repo')
jest.mock('../../core/config', () => ({
  auth: {
    secret: 'test-secret',
    expiresIn: '1h'
  }
}))

const mockedUserRepo = jest.mocked(UserRepository, { shallow: true })
const mockedMailService = jest.mocked(MailService, { shallow: true })
const mockedJwt = jest.mocked(jsonwebtoken, { shallow: true })
const mockedCrypto = jest.mocked(crypto, { shallow: true })

describe('SecurityService', () => {
  let securityService: SecurityService

  beforeEach(() => {
    jest.clearAllMocks()
    securityService = new SecurityService()
  })

  describe('userRegister', () => {
    it('should throw an error if the user already exists', async () => {
      mockedUserRepo.prototype.getByUsername = jest.fn().mockResolvedValueOnce({ email: 'existing@example.com' })
      const data: RegisterPostDtoSchema = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      }
      await expect(securityService.userRegister(data)).rejects.toThrow(HandleError)
    })

    it('should create a new user if the user does not exist', async () => {
      mockedUserRepo.prototype.getByUsername = jest.fn().mockResolvedValueOnce(null)
      mockedUserRepo.prototype.create = jest.fn().mockResolvedValueOnce('user-uuid')
      const data: RegisterPostDtoSchema = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe'
      }
      const result = await securityService.userRegister(data)
      expect(result).toBe('user-uuid')
    })
  })

  describe('userLogin', () => {
    it('should throw an error if credentials are invalid', async () => {
      mockedUserRepo.prototype.getByUsername = jest.fn().mockResolvedValueOnce(null)
      const data = { email: 'nonexistent@example.com', password: 'password123' }
      await expect(securityService.userLogin(data)).rejects.toThrow(HandleError)
    })

    it('should return a token if credentials are valid', async () => {
      mockedUserRepo.prototype.getByUsername = jest.fn().mockResolvedValueOnce({ uuid: 'user-uuid' })
      mockedJwt.sign = jest.fn().mockReturnValueOnce('test-token')
      const data = { email: 'user@example.com', password: 'password123' }
      const result = await securityService.userLogin(data)
      expect(result).toEqual({ token: 'test-token' })
    })
  })

  describe('validateToken', () => {
    it('should throw an error if the token is invalid', async () => {
      mockedJwt.verify.mockImplementationOnce(() => {
        throw new jsonwebtoken.JsonWebTokenError('Invalid token')
      })
      await expect(securityService.validateToken('invalid-token')).rejects.toThrow(HandleError)
    })

    it('should throw an error if the token is expired', async () => {
      mockedJwt.verify.mockImplementationOnce(() => {
        throw new jsonwebtoken.TokenExpiredError('Token expired', new Date())
      })
      await expect(securityService.validateToken('expired-token')).rejects.toThrow(HandleError)
    })

    it('should return the uuid if the token is valid', async () => {
      mockedJwt.verify = jest.fn().mockReturnValueOnce({ uuid: 'user-uuid' })
      const result = await securityService.validateToken('valid-token')
      expect(result).toEqual({ uuid: 'user-uuid' })
    })
  })

  describe('userForgotPassword', () => {
    it('should throw an error if the user does not exist', async () => {
      mockedUserRepo.prototype.getByUsername = jest.fn().mockResolvedValueOnce(null)
      const data = { email: 'nonexistent@example.com' }
      await expect(securityService.userForgotPassword(data)).rejects.toThrow(HandleError)
    })

    it('should reset the password and send an email if the user exists', async () => {
      const user = { email: 'user@example.com', firstName: 'John', lastName: 'Doe', uuid: 'user-uuid' }
      const newPassword = Buffer.from('randompassword').toString('base64url')
      mockedUserRepo.prototype.getByUsername = jest.fn().mockResolvedValueOnce(user)
      mockedCrypto.randomBytes = jest.fn().mockReturnValueOnce(Buffer.from('randompassword'))
      mockedUserRepo.prototype.update = jest.fn().mockResolvedValueOnce(null)
      mockedMailService.prototype.sendMail = jest.fn().mockResolvedValueOnce(undefined)

      const data = { email: 'user@example.com' }
      await securityService.userForgotPassword(data)

      expect(mockedUserRepo.prototype.update).toHaveBeenCalledWith({
        uuid: 'user-uuid',
        password: newPassword
      })
      expect(mockedMailService.prototype.sendMail).toHaveBeenCalledWith(
        'user@example.com',
        'Password Reset',
        `Hi John Doe, you new password is <strong>${newPassword}</strong>`
      )
    })
  })
})
