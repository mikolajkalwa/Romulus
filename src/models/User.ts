import { Schema, model } from 'mongoose';
import { IUser } from '../interfaces/IUser';

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  isClown: {
    type: Boolean,
    required: false,
    default: false,
  },
  birthday: {
    type: String,
    required: false,
    default: null,
  },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

const User = model<IUser>('User', userSchema);

export default User;
