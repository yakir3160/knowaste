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
    getForecastDemand,
    getBatchAnalytics
} from '../controllers/analyticsController.js';

const router = Router();

router.use(verifyToken);

router.get('/sales', getSalesByDateRange);//done
router.get('/top-dishes', getTopSellingDishes);// done
router.get('/least-selling-dishes', getLeastSellingDishes);//done
router.get('/waste', getWasteAnalysis);
router.get('/top-wasted-ingredients', getTopWastedIngredients);//done
router.get('/low-stock-items', getLowStockItems);//done
router.get('/revenue-vs-waste', getRevenueVsWaste);//timeframe
router.get('/forecast-demand', getForecastDemand);//
router.get('/non-profitable-items', getNonProfitableItems);
router.get('/batch', getBatchAnalytics);


export default router;
