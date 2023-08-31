import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  whos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  destination: { type: String, required: true },
  currentLocation: { type: String, required: true },
  status: {
    type: String,
    enum: ['accepted', 'denied', 'processing'],
    required: true,
  },
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
