import express from "express";
import cors from "cors";
import 'dotenv/config'
import connectDB from "./config/db.js";
import path from "path";
import BusinessRegistrationRouter from "./routes/businessRegistrationRoutes.js";
import authRouter from "./routes/authRoutes.js";
import ProductEnquiryRouter from "./routes/ProductEnquiryRoutes.js";
import adminRouter from "./routes/adminCategoryRoutes.js";
import AboutBrandRouter from "./routes/AboutBrandRoutes.js";
import ProductRouter from "./routes/productRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import ProductEnquiryrouter from "./routes/productsEnquiryRoutes.js";
import contactRouter from "./routes/contactRoutes.js";
import newsletterRouter from "./routes/newsletterRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";



const app = express();

// ✅ serve static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
connectDB();



app.use("/api/businessregistration", BusinessRegistrationRouter);
app.use("/api/auth", authRouter);
app.use("/api/productenquiry",  ProductEnquiryRouter);
app.use("/api/admin", adminRouter)
app.use("/api/aboutbrand", AboutBrandRouter)
app.use("/api/blog",blogRouter);
app.use("/api/product", ProductRouter)
app.use("/api/products/enquiry", ProductEnquiryrouter);
app.use("/api/contact", contactRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
