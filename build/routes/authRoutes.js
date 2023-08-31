import express from 'express';
import { login, me } from '../controllers/authControllers.js';
import JWT from '../providers/JWT.js';
const router = express.Router();
const jwt = new JWT();
router.post('/login', login); //prefix to /auth/login
router.get('/me', jwt.authenticateToken, me); //prefix to /auth/me
export default router;
//# sourceMappingURL=authRoutes.js.map