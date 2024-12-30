import mongoose, { Model } from 'mongoose'
import { Todo, User } from 'todo-types'
import crypto from 'crypto'

const SALT_WORK_FACTOR = 10

interface UserModel extends Model<User> {
  _id?: string
  password: string
  todos: Todo[]
  comparePassword(candidatePassword: string): boolean
}

const UserSchema = new mongoose.Schema<User, {}, UserModel>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID()
    },
    firstName: {
      type: String,
      required: [true, 'firstname_required'],
      minlength: [2, 'firstname_too_short'],
      maxlength: [30, 'firstname_too_long']
    },
    lastName: {
      type: String,
      required: [true, 'lastname_required'],
      minlength: [2, 'lastname_too_short'],
      maxlength: [30, 'lastname_too_long']
    },
    email: {
      type: String,
      required: [true, 'email_required'],
      unique: [true, 'email_already_exists'],
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'invalid_email_format']
    },
    password: {
      type: String,
      required: [true, 'password_required'],
      minlength: [8, 'password_too_short'],
      set: (password: string) => {
        if (!password) return password
        const salt = crypto.randomBytes(SALT_WORK_FACTOR).toString('hex')
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
        return `${salt}:${hash}`
      }
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

UserSchema.virtual('todos', {
  ref: 'Todo',
  localField: 'uuid',
  foreignField: 'owner'
})

UserSchema.method('comparePassword', function comparePassword(candidatePassword: string) {
  const hashedPassword = this.password
  const [salt, hash] = hashedPassword.split(':')
  const candidateHash = crypto.pbkdf2Sync(candidatePassword, salt, 1000, 64, 'sha512').toString('hex')
  return hash === candidateHash
})

export const UserModel = mongoose.model('User', UserSchema, 'users')
