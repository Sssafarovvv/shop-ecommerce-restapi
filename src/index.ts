import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from "multer"
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import 'reflect-metadata';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { register } from './controllers/authControllers.js';
import { ConnectOptions } from 'mongoose';
import http from "http"
// import postRoutes from "./routes/postRoutes"

const PORT = process.env.PORT || 6001;
const MONGO_URL = process.env.MONGO_URL || '';
/* CONFIGURATIONS */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();

const httpServer: any = http.createServer(app);

httpServer.listen(PORT, function(){
	console.log(`Listening to port ${PORT}`);
})

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
const allowedOrigins = "*";
app.use(
  cors({
    origin: allowedOrigins,
  }),
);
// app.use(morgan('common'));
app.use(bodyParser.json({ limit: '8mb' }));
app.use(bodyParser.urlencoded({ limit: '8mb', extended: true }));
app.use('/assets', express.static(path.join(__dirname, '/assets')));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, "/assets");
  },
  filename: function (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: any) => void) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post('/auth/register', upload.single('picture'), register);

/* ROUTES */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

/* MONGOOSE SETUP */

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {})
  .catch((error) => console.log(`${error} не удалось соединиться`));

