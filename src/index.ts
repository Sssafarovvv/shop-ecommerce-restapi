import { errorHandler } from './providers/errorHandler.js';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRotes from './routes/orderRoutes.js';
import { ConnectOptions } from 'mongoose';
import https from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { handleShutdown } from './providers/shutdownHandler.js';
import { createHttpTerminator } from 'http-terminator';
dotenv.config();

/* SERVER SETUP */
const app = express();
export const server = https.createServer(app);
export const httpTerminator = createHttpTerminator({
  server,
});
server.listen(process.env.PORT || 6001, function () {
  console.log(`Listening to port ${process.env.PORT || 6001}`);
});

/* POLITICS SETUP */
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS as string,
  }),
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '8mb' }));
app.use(bodyParser.urlencoded({ limit: '8mb', extended: true }));
app.use('/assets', express.static(path.join(__dirname, '/assets')));

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/orders', orderRotes);
app.use(errorHandler);

/* Capture OS interrupt signals */
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

/* MONGOOSE SETUP */
mongoose
  .connect(
    process.env.MONGO_URL as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions,
  )
  .then(() => {
    console.log(`Connected to database`);
  })
  .catch((error) => console.log(`${error} Didn't connect to database`));
