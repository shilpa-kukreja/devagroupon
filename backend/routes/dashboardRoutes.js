import express from 'express';

import {
  getDashboardStats,
  getDashboardCharts,
  getDashboardOverview
} from '../controllers/dashboardController.js';

const dashboardRouter = express.Router();


dashboardRouter.get('/stats', getDashboardStats);
dashboardRouter.get('/charts', getDashboardCharts);
dashboardRouter.get('/overview', getDashboardOverview);


export default dashboardRouter;
