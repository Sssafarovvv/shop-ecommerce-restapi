import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    role: {
      type: String,
      enum: ['admin', 'customer'],
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: false,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false,
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);
export default User;
