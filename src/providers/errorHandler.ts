import { Request, Response, NextFunction } from 'express';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);

  // Определение типа ошибки
  if (error.name === 'UnauthorizedError') {
    // Ошибка авторизации (JWT)
    return res.status(401).json({ error: 'Unauthorized' });
  } else if (error.name === 'ValidationError') {
    // Ошибка валидации Mongoose
    return res.status(400).json({ error: error.message });
    //   } else if (error.name === 'CastError') {
    //     // Ошибка приведения типов ObjectId в Mongoose
    //     return res.status(400).json({ error: 'Invalid ObjectId' });
  } else if (error.message === 'Not Found') {
    // Ресурс не найден
    return res.status(404).json({ error: 'Not Found' });
  } else if (error.message === 'Connection failed') {
    // Ошибка подключения к базе данных
    return res.status(500).json({ error: 'Database connection error' });
  }

  // Если тип ошибки не определен, вернуть общую 500 ошибку
  res.status(500).json({ error: 'Internal server error' });
};
