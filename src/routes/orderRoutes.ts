import express from 'express';
import { getOrders, denyOrder, acceptOrder } from '../controllers/orderController.js';
import JWT from '../providers/JWT.js';
import connectTimeout from 'connect-timeout';

const jwt = new JWT();

const router = express.Router();

router.post('/order-create', jwt.authenticateToken, getOrders);
router.post('/order-deny', jwt.authenticateToken, connectTimeout('10s'), denyOrder);
router.post('/order-accept', jwt.authenticateToken, connectTimeout('10s'), acceptOrder);
router.get('/orders/:userId', jwt.authenticateToken);

export default router;
