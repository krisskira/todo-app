import mongoose, { Model } from 'mongoose'
import crypto from 'crypto'
import { Todo, User } from 'todo-types'

interface TodoModel extends Model<Todo> {
  _id?: string
  owner: string
  ownerDetails: User
}

const TodoSchema = new mongoose.Schema<Todo & { owner: string }, {}, TodoModel>(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomUUID()
    },
    title: {
      type: String,
      required: true,
      minlength: [2, 'title_too_short'],
      maxlength: [30, 'title_too_long']
    },
    description: {
      type: String,
      required: true,
      minlength: [2, 'description_too_short'],
      maxlength: [255, 'description_too_long']
    },
    completed: {
      type: Boolean,
      default: false,
      set: (v: 'true' | 'false' | boolean) => v === 'true' || v === true
    },
    owner: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

TodoSchema.virtual('ownerDetails', {
  ref: 'User',
  localField: 'owner',
  foreignField: 'uuid',
  justOne: true
})

export const TodoModel = mongoose.model('Todo', TodoSchema, 'todos')
