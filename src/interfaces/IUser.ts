import { Document } from 'mongoose';

export interface IUser extends Document {
  id: string;
  isClown?: boolean;
  birthday?: string;

}
