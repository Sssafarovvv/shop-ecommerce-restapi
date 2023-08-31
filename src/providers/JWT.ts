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

  async authenticateSocketToken(socket: any, next: any) {
    if (socket.handshake.query && socket.handshake.query.token) {
      const token = socket.handshake.query.token;
      jwt.verify(token, process.env.JWT_SECRET as string, async (err: any, user: any) => {
        if (err) {
          socket.disconnect();
          return next(new Error('Authentication error'));
        }

        const foundUser = await users.findOne({ username: user.username }).lean();
        if (!foundUser) {
          socket.disconnect();
          return next(new Error('Authentication error'));
        }

        const passwordMatch = await bcrypt.compare(user.password, foundUser.password);
        if (!passwordMatch) {
          socket.disconnect();
          return next(new Error('Authentication error'));
        }

        socket.user = user;
        next();
      });
    } else {
      socket.disconnect();
      return next(new Error('Authentication error'));
    }
  }
}
