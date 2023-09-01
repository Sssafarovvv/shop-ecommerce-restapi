import express from 'express';
import { getOrders } from '../controllers/orderController.js';
import JWT from '../providers/JWT.js';

const jwt = new JWT();

const router = express.Router();

router.post('/order-create', jwt.authenticateToken, getOrders);
router.post('/order-deny', jwt.authenticateToken);
router.get('/orders/:userId', jwt.authenticateToken);

export default router;
