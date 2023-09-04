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

export const setOrderLocation = async (req: any, res: Response) => {
  try {
    const { location, id } = req.body;

    const order = await Order.findByIdAndUpdate(id, { $set: { location } }).populate('Product');

    if (!order) {
      throw new Error(`No such order with this id: ${id}`);
    }

    order?.save();

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/*needs further refactoring and purchases implementations*/
export const acceptOrder = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, { $set: { status: 'accepted' } });
    res.status(200).json({ message: 'Order accepted successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};

export const denyOrder = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, { $set: { status: 'denied' } });
    res.status(200).json({ message: 'Order denied successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
};
