import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../models/UserSchema.js';
export default class JWT {
  async generateAccessToken(email: string, password: string, id: string): Promise<string> {
    password = await bcrypt.hash(password, 10);

    return new Promise((resolve, reject) => {
      const token = jwt.sign(
        {
          email,
          password,
          id,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '604800s' },
      );

      users
        .updateOne(
          {
            email,
            password,
          },
          {
            $set: { access_token: token },
          },
        )
        .then(() => {
          resolve(token);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }

  // middleware
  async authenticateToken(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
      if (err) return res.status(403).send(err);
      req.user = user;

      next();
    });
  }
}
