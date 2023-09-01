import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  img: { type: String, required: true },
  price: { type: Number, required: true },
  weights: [{
    type: Number,
    required: true,
  }],
  total: {
    type: Number,
    required: false,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: false,
    },
  ],
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
