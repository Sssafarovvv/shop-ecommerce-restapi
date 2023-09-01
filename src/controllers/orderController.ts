import { Response } from 'express';
import Order from '../models/OrderSchema.js';
import User from '../models/UserSchema.js';

export const getOrders = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      throw new Error(`No such user with ${userId}`);
    }

    const user = await User.findById(userId);

    let orders;

    if (user?.role !== 'admin') {
      orders = await Order.find({ whos: userId }).populate('Product');
    } else {
      orders = await Order.find({}).populate('Product');
    }

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
