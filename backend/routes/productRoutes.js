// routes/productRoutes.js
import express from 'express';
import { createProduct, deleteProduct, getCategoriesForDropdown, getProductById, getSalesProducts, updateProduct } from '../controllers/productControllers.js';
import { uploadProductImages } from '../middlewares/productMiddleware.js';



const ProductRouter = express.Router();



ProductRouter.get('/categories', getCategoriesForDropdown);
ProductRouter.post('/products',uploadProductImages, createProduct);
ProductRouter.get('/products', getSalesProducts);
ProductRouter.get('/products/:id', getProductById);
ProductRouter.put('/products/:id',uploadProductImages, updateProduct);
ProductRouter.delete('/products/:id', deleteProduct);

export default ProductRouter;