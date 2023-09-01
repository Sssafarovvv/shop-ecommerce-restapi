import { Response } from 'express';
import Product from '../models/ProductSchema.js';

export const saveProductInDB = async (req: any, res: Response) => {
  try {
    const { products } = req.body;
    const savedProducts = [];
    const errorProducts = [];

    for (const product of products) {
      const newProduct = await Product.create({
        img: product.img,
        price: product.price,
        weights: product.weights.map((weight: number[]) => weight),
        total: product.total,
      });

      if (!product.price || !product.img || !product.weights || !product.total) {
        errorProducts.push(product);
      }

      savedProducts.push(newProduct);
    }

    res.json({ savedProducts, errorProducts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
