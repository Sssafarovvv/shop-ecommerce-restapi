import { Response } from 'express';
import User from '../models/UserSchema.js';
export const setAdress = async (req: any, res: Response) => {
  try {
    const { id } = req.user.id;
    const { adress } = req.body;

    const person = await User.findByIdAndUpdate(id, { $set: { adress } });

    await person?.save();
    res.json(person);
  } catch (error) {}
};
