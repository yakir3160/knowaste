import { Router } from 'express';
import { verifyToken } from "../middleware/authMiddleware.js";
import {
    getSalesByDateRange,
    getTopSellingDishes,
    getLeastSellingDishes,
    getWasteAnalysis,
    getTopWastedIngredients,
    getNonProfitableItems,
    getLowStockItems,
    getRevenueVsWaste,
    getForecastDemand
} from '../controllers/analyticsController.js';

const router = Router();

router.use(verifyToken);

router.get('/sales', getSalesByDateRange);
router.get('/top-dishes', getTopSellingDishes);
router.get('/least-selling-dishes', getLeastSellingDishes);
router.get('/waste', getWasteAnalysis);
router.get('/top-wasted-ingredients', getTopWastedIngredients);
router.get('/non-profitable-items', getNonProfitableItems);
router.get('/low-stock-items', getLowStockItems);
router.get('/revenue-vs-waste', getRevenueVsWaste);
router.get('/forecast-demand', getForecastDemand);

export default router;
