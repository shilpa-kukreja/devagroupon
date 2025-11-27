// routes/aboutBrandRoutes.js
import express from "express";
import { createAboutBrand, deleteAboutBrand, getAboutBrandById, getAboutBrandsByBrand, getAboutBrandsBySectionType, getAllAboutBrands, updateAboutBrand } from "../controllers/AboutBrandController.js";
import AboutBrandMiddleware from "../middlewares/AboutBrandMiddleware.js";

const AboutBrandRouter = express.Router();

// Public routes
AboutBrandRouter.get("/about-brands", getAllAboutBrands);
AboutBrandRouter.get("/brand/:brandId", getAboutBrandsByBrand);
AboutBrandRouter.get("/section/:sectionType", getAboutBrandsBySectionType);
AboutBrandRouter.get("/:id", getAboutBrandById);

// Admin routes (protected)
AboutBrandRouter.post("/about-brands", AboutBrandMiddleware.single('image'), createAboutBrand);
AboutBrandRouter.put("/:id", AboutBrandMiddleware.single('image'), updateAboutBrand);
AboutBrandRouter.delete("/:id", deleteAboutBrand);

export default AboutBrandRouter;