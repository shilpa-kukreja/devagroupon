import express from "express";
import { adminLogin, deleteBusiness, getAllBusinesses, getBusinessById, registerBusiness, updateBusinessStatus } from "../controllers/businessRegistrationController.js";


const BusinessRegistrationRouter = express.Router();

BusinessRegistrationRouter.post("/register", registerBusiness);
BusinessRegistrationRouter.get("/get", getAllBusinesses);
BusinessRegistrationRouter.get("/:id", getBusinessById);
BusinessRegistrationRouter.delete("/:id", deleteBusiness);
BusinessRegistrationRouter.put("/:id/status", updateBusinessStatus);
BusinessRegistrationRouter.post('/admin-login', adminLogin);

export default BusinessRegistrationRouter;
