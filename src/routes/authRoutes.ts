import express from 'express';
import { login, me, register } from '../controllers/authControllers.js';
import JWT from '../providers/JWT.js';
import { upload } from '../providers/uploader.js';

const router = express.Router();

const jwt = new JWT();
//auth
router.post('/login', login);
router.get('/me', jwt.authenticateToken, me);
/* ROUTE WITH FILES */
router.post('/register', upload.single('picture'), register);

export default router;
