import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  whos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  destination: { type: String, required: false },
  location: { type: String, required: true },
  status: {
    type: String,
    enum: ['accepted', 'denied', 'processing'],
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prodcut"
  }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
