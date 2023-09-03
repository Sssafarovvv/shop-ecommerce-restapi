import express from 'express';
import { setAdress } from '../controllers/userController.js';
import { errorHandler } from '../providers/errorHandler.js';
import JWT from '../providers/JWT.js';
import { upload } from '../providers/uploader.js';

const router = express.Router();

const jwt = new JWT();
//auth
router.put('/set-adress', jwt.authenticateToken, setAdress);
export default router;
