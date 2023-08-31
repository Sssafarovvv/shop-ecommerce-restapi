import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/UserSchema.js';
import { Request, Response } from 'express';
import JWT from '../providers/JWT.js';
dotenv.config();

/* REGISTER USER */
export const register = async (req: Request, res: Response) => {
  try {
    const { userName, firstName, lastName, email, password, picturePath, friends } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ userName, firstName, lastName, email, password: passwordHash, picturePath, friends });

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email уже занят' });
    }

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err: any) {
    res.status(500).json({ error: 'Произошла неизвестная ошибка' });
  }
};

/* AUTHENTIC. */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email && password) {
    try {
      const user = await User.findOne({ email });

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);

        let jwt = new JWT();
        if (passwordMatch) {
          const token = await jwt.generateAccessToken(user.email, user.password, user._id.toString());

          // res.status(200).send({ token, user });
          res.status(200).send(token);
        } else {
          res.status(400).send({
            is_success: false,
            message: 'Неправильный пароль',
          });
        }
      } else {
        res.status(400).send({
          is_success: false,
          message: 'Пользователь не найден',
        });
      }
    } catch (error) {
      res.status(500).send({
        is_success: false,
        message: 'Внутренняя ошибка сервера',
      });
    }
  } else {
    res.status(400).send({
      is_success: false,
      message: 'Отсутствует имя пользователя или пароль',
    });
  }
};

/* GETTING USER AFTER AUTH. */
export const me = async (req: any, res: Response) => {
  try {
    // Проверка наличия аутентификации
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Получение информации о текущем пользователе
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Возврат информации о пользователе
    res.json(
      user,
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
