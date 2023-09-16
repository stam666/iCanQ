import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'restaurant';
}

const userSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant'],
    required: true,
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;