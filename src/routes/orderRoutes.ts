import express from 'express';
import { getOrders, denyOrder, acceptOrder } from '../controllers/orderController.js';
import JWT from '../providers/JWT.js';

const jwt = new JWT();

const router = express.Router();

router.post('/order-create', jwt.authenticateToken, getOrders);
router.post('/order-deny', jwt.authenticateToken, denyOrder);
router.post('/order-accept', jwt.authenticateToken, acceptOrder);
router.get('/orders/:userId', jwt.authenticateToken);

export default router;
