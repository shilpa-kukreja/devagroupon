import express from 'express';
import { addsubscriber, deleteSubscriber, getSubscribers } from '../controllers/newsletterController.js';



const newsletterRouter = express.Router();
newsletterRouter.post('/subscribe', addsubscriber);
newsletterRouter.get('/subscribers', getSubscribers);
newsletterRouter.delete('/subscribers/:id', deleteSubscriber);


export default newsletterRouter;