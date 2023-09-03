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
import userRoutes from './routes/orderRoutes.js';
import { ConnectOptions } from 'mongoose';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const PORT = process.env.PORT || 6001;
const MONGO_URL = process.env.MONGO_URL || '';
dotenv.config();
const app = express();

const httpServer: any = http.createServer(app);

httpServer.listen(PORT, function () {
  console.log(`Listening to port ${PORT}`);
});

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
const allowedOrigins = '*';
app.use(
  cors({
    origin: allowedOrigins,
  }),
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '8mb' }));
app.use(bodyParser.urlencoded({ limit: '8mb', extended: true }));
app.use('/assets', express.static(path.join(__dirname, '/assets')));

/* ROUTES */
app.use(errorHandler)
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

/* MONGOOSE SETUP */
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log(`Удалось соединиться`);
  })
  .catch((error) => console.log(`${error} не удалось соединиться`));
