import { Response } from 'express';
import Review from '../models/ReviewSchema.js';
import Product from '../models/ProductSchema.js';

export const saveProductInDB = async (req: any, res: Response) => {
  try {
    const { products } = req.body;
    const savedProducts = [];
    const errorProducts = [];

    for (const product of products) {
      if (!product.price || !product.img || !product.weights || !product.total || !product.name) {
        errorProducts.push(product);
      }

      const newProduct = await Product.create({
        name: product.name,
        img: product.img,
        price: product.price,
        weights: product.weights.map((weight: number[]) => weight),
        total: product.total,
      });

      savedProducts.push(newProduct);
    }

    res.json({ savedProducts, errorProducts });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const postReview = async (req: any, res: Response) => {
  try {
    const { content, productId, userId } = req.body;

    const review = await Review.create({
      user: userId,
      content,
      product: productId,
    });

    await review.save();

    res.status(201).json({ message: 'Отзыв успешно создан', review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const getReviews = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;
    const reviews = await Review.find(productId).populate('user').exec();

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
