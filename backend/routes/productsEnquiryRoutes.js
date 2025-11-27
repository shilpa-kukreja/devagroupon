// routes/productEnquiryRoutes.js
import express from 'express';
import { createEnquiry, deleteEnquiry, getAllEnquiries, getEnquiryById, updateEnquiry } from '../controllers/productEnquiryControllers.js';



const ProductEnquiryrouter = express.Router();


ProductEnquiryrouter.post('/create', createEnquiry);


ProductEnquiryrouter.get('/get', getAllEnquiries);


ProductEnquiryrouter.get('/:id', getEnquiryById);


ProductEnquiryrouter.put('/:id', updateEnquiry);


ProductEnquiryrouter.delete('/:id', deleteEnquiry);

export default ProductEnquiryrouter;
