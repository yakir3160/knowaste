import { Router } from 'express';
import AnalyticsService from '../services/analyticsService.js';
import {verifyToken} from "../middleware/authMiddleware.js";

const router = Router();

router.get('/recommendations', async (req, res) => {
    try {
        const { averageDailyUsage, daysToOrder, safetyStock, address, city } = req.query;

        if (!averageDailyUsage || !daysToOrder || !safetyStock || !address || !city) {
            return res.status(400).json({ message: 'Missing required query parameters.' });
        }

        const result = await AnalyticsService.generateRecommendations(
            req.user.id,
            parseFloat(averageDailyUsage),
            parseInt(daysToOrder),
            parseFloat(safetyStock),
            address,
            city
        );

        res.status(200).json(result);
    } catch (error) {
        console.error('Error generating recommendations:', error.message);
        res.status(500).json({ error: 'Failed to generate recommendations.' });
    }
});

router.get('/order-recommendations',verifyToken, async (req, res) => {
    try {
        const result = await AnalyticsService.generateOrderRecommendations(req.user.id);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error generating order recommendations:', error.message);
        res.status(500).json({ error: 'Failed to generate order recommendations.' });
    }
});


// Route to test weather data
router.get('/test-weather', async (req, res) => {
    try {
        const { address, city } = req.query;

        if (!address || !city) {
            return res.status(400).json({ message: 'Address and city are required' });
        }

        const weatherData = await AnalyticsService.testGetWeatherData(address, city);
        res.status(200).json(weatherData);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

export default router;
