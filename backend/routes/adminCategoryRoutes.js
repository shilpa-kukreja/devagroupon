import express from 'express';
import {
  createMainCategory,
  getMainCategories,
  updateMainCategory,
  deleteMainCategory,
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  createSubcategory,
  getSubcategories,
  updateSubcategory,
  deleteSubcategory,
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
  CreateCountries,
  getCountries,
  updateCountry,
  deleteCountry
} from '../controllers/adminCategoryController.js';
import upload from '../middlewares/MaincategoryMulter.js';
import subcategoryupload from '../middlewares/subcategoryUpload.js';
import categoyMiddleware from '../middlewares/categoryMiddleware.js';
import brandMiddleware from '../middlewares/brandMiddleware.js';
import countryMiddleware from '../middlewares/countryMiddleware.js';

const adminRouter = express.Router();

// Main Categories
adminRouter.post('/main-categories',upload.fields([
  { name: "img", maxCount: 1 },
  { name: "banner", maxCount: 1 }
]), createMainCategory);
adminRouter.get('/main-categories', getMainCategories);
adminRouter.put('/main-categories/:id',upload.fields([
  { name: "img", maxCount: 1 },
  { name: "banner", maxCount: 1 }
]), updateMainCategory);
adminRouter.delete('/main-categories/:id', deleteMainCategory);

// Categories
adminRouter.post('/categories', categoyMiddleware.single('img'), createCategory);
adminRouter.put('/categories/:id', categoyMiddleware.single('img'), updateCategory);
adminRouter.get('/categories', getCategories);
adminRouter.delete('/categories/:id', deleteCategory);

// Subcategories
adminRouter.post('/subcategories', subcategoryupload.single('img'), createSubcategory);
adminRouter.put('/subcategories/:id', subcategoryupload.single('img'), updateSubcategory);
adminRouter.get('/subcategories', getSubcategories);
adminRouter.delete('/subcategories/:id', deleteSubcategory);

// Brands
adminRouter.post('/brands', brandMiddleware.single('img'), createBrand);
adminRouter.put('/brands/:id', brandMiddleware.single('img'), updateBrand);
adminRouter.get('/brands', getBrands);
adminRouter.delete('/brands/:id', deleteBrand);

// Countries
adminRouter.post('/countries',countryMiddleware.single('img'), CreateCountries);
adminRouter.get('/countries', getCountries);
adminRouter.put('/countries/:id',countryMiddleware.single('img'), updateCountry);
adminRouter.delete('/countries/:id', deleteCountry);

export default adminRouter;