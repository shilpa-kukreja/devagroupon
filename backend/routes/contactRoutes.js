import express from 'express';
import { contactMessage, deleteContactMessage, getContactMessages } from '../controllers/contactController.js';




const contactRouter = express.Router();

contactRouter.post('/contact', contactMessage);
contactRouter.get('/contact-messages', getContactMessages);
contactRouter.delete('/contact-messages/:id', deleteContactMessage);


export default contactRouter;