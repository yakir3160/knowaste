import { db } from '../../config/firebase-admin.js';
import Holidays from 'date-holidays';
import axios from "axios";

class AnalyticsService {
    async getRealtimeAnalytics(userId, specificDate = new Date()) {
        try {
            const [currentData, historicalData] = await Promise.all([
                this.getCurrentData(userId, specificDate),
                this.getHistoricalData(userId)
            ]);

            const analysis = await this.analyzeData(userId, historicalData);
            await this.updateAnalyticsInDB(userId, analysis);

            return {
                success: true,
                data: analysis,
                lastUpdated: specificDate
            };
        } catch (error) {
            console.error('Realtime analytics error:', error);
            return { success: false, error: error.message };
        }
    }
    async getHistoricalData(userId) {
        const salesQuery = await db
            .collection('users').doc(userId)
            .collection('reports').doc('sales')
            .collection('salesReports')
            .where('status', '==', 'submitted')
            .orderBy('date', 'desc')
            .limit(365)
            .get();

        return salesQuery.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate()
        }));
    }

    async getCurrentData(userId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const salesQuery = await db
            .collection('users').doc(userId)
            .collection('reports').doc('sales')
            .collection('salesReports')
            .where('date', '>=', startOfDay)
            .where('status', '==', 'submitted')
            .get();

        return await Promise.all(salesQuery.docs.map(async doc => ({
            ...doc.data(),
            date: doc.data().date.toDate(),
            weather: await this.getWeatherData(doc.data().date)
        })));
    }

    async updateAnalyticsInDB(userId, analysis) {
        const analyticsRef = db.collection('analytics').doc(userId);

        await analyticsRef.set({
            lastUpdated: new Date(),
            predictions: analysis.data,
            metadata: analysis.metadata
        }, { merge: true });
    }

    async testGetWeatherData(address, city) {
        try {
            const currentDate = new Date();
            return await this.getWeatherData(currentDate, address, city);
        } catch (error) {
            console.error('Error testing weather data:', error.message);
            throw new Error('Failed to fetch weather data');
        }
    }

    async getWeatherData(date, address, city) {
        try {
            const apiKey = process.env.OPENWEATHER_API_KEY;

            const geoResponse = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
                params: {
                    q: `${address}, ${city}`,
                    limit: 1,
                    appid: apiKey
                }
            });

            if (geoResponse.data.length === 0) {
                return { conditions: 'unknown' };
            }

            const { lat, lon } = geoResponse.data[0];

            const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    lat,
                    lon,
                    appid: apiKey,
                    units: 'metric'
                }
            });

            const forecastData = forecastResponse.data.list;

            const dailyForecast = forecastData.map(entry => ({
                date: entry.dt_txt,
                temperature: entry.main.temp,
                humidity: entry.main.humidity,
                conditions: entry.weather[0]?.description || 'unknown'
            }));

            return dailyForecast;
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            return [];
        }
    }

    async calculateSalesAnalytics(userId, timeRange) {
        try {
            let salesQuery = db
                .collection('users').doc(userId)
                .collection('reports').doc('sales')
                .collection('salesReports')
                .where('status', '==', 'submitted');

            const startDate = this.getStartDate(timeRange);
            if (startDate) {
                salesQuery = salesQuery.where('date', '>=', startDate);
            }

            const snapshot = await salesQuery.get();
            const sales = snapshot.docs.map(doc => doc.data());

            const analytics = {
                totalRevenue: 0,
                itemsSold: {},
                topItems: [],
                averageOrderValue: 0,
            };
            sales.forEach(sale => {
                sale.items.forEach(item => {
                    analytics.totalRevenue += item.totalPrice;
                    analytics.itemsSold[item.menuItem] = (analytics.itemsSold[item.menuItem] || 0) + item.quantity;
                })
            })

            analytics.topItems = Object.entries(analytics.itemsSold)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
            analytics.averageOrderValue = analytics.totalRevenue / sales.length || 0;

            return {
                success: true,
                data: analytics,
                message: 'Sales analytics calculated successfully'
            }
        } catch (error) {
            console.error('Error calculating sales analytics:', error);
            return { success: false, error: error.message };
        }
    }

    async analyzeWaste(userId, timeRange) {
        try {
            let wasteQuery = db
                .collection('users').doc(userId)
                .collection('reports').doc('waste')
                .collection('wasteReports')
                .where('status', '==', 'submitted');

            const startDate = this.getStartDate(timeRange);
            if (startDate) {
                wasteQuery = wasteQuery.where('date', '>=', startDate);
            }

            const snapshot = await wasteQuery.get();
            const wasteReports = snapshot.docs.map(doc => doc.data());

            const analysis = {
                totalWasteCost: 0,
                wasteByReason: {},
                wasteByIngredient: {},
                topWastedIngredients: []
            };

            wasteReports.forEach(report => {
                report.items.forEach(item => {
                    analysis.totalWasteCost += item.cost;
                    analysis.wasteByReason[item.reason] = (analysis.wasteByReason[item.reason] || 0) + item.cost;
                    analysis.wasteByIngredient[item.ingredientId] = (analysis.wasteByIngredient[item.ingredientId] || 0) + item.cost;
                })
            })

            analysis.topWastedIngredients = Object.entries(analysis.wasteByIngredient)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)

            return {
                success: true,
                data: analysis,
                message: 'Waste analysis calculated successfully'
            }
        } catch (error) {
            console.error('Error calculating waste analysis:', error);
            return { success: false, error: error.message };
        }
    }
    /*
    * Use generateRecommendations:
    * When you need a quick, specific recommendation for a single item or category.
    * Example: "How much coffee should I order for the next week?"

    * Use generateOrderRecommendations:
    * When planning orders for all inventory items.
    * Example: "What do I need to order for the entire restaurant?"
    * */

    async generateRecommendations(userId, averageDailyUsage, daysToOrder, safetyStock, address, city) {
        try {
            // Fetch real-time analytics, including weather data
            const analytics = await this.getRealtimeAnalytics(userId);

            // Use weather impact from analytics
            const weatherImpact = analytics.data.weatherImpact || 1.0;

            // Calculate recommended quantity with weather adjustments
            const recommendedQuantity = Math.ceil(
                (averageDailyUsage * daysToOrder * weatherImpact) + safetyStock
            );

            return {
                success: true,
                recommendedQuantity,
                weatherImpact
            };
        } catch (error) {
            console.error('Error generating recommendations:', error.message);
            return { success: false, error: error.message };
        }
    }

    async generateOrderRecommendations(userId) {
        try {
            // Fetch inventory data
            const inventorySnapshot = await db
                .collection('inventory')
                .doc(userId)
                .collection('inventoryItems')
                .get();

            // Fetch sales analytics to get top items
            const salesAnalytics = await this.calculateSalesAnalytics(userId, 'weekly');
            const topItems = salesAnalytics.data.topItems.map(item => item[0]); // Extract top item names

            const recommendations = [];

            for (const doc of inventorySnapshot.docs) {
                const item = doc.data();

                const expiringItems = item.orderHistory?.filter(order => {
                    const expirationDate = new Date(order.expirationDate);
                    const daysUntilExpiration = (expirationDate - new Date()) / (1000 * 60 * 60 * 24);
                    return daysUntilExpiration <= 14; // Items expiring within 2 weeks
                }) || [];

                // Calculate usage rate
                const usageHistory = await this.getUsageHistory(userId, doc.id);
                const seasonalFactor = this.calculateSeasonalFactor(item.categoryName);
                const averageDailyUsage = item.usageStats?.averageDailyUsage || 0;

                const daysToOrder = 14;
                const safetyStock = item.minStockLevel || (averageDailyUsage * 7);
                const recommendedQuantity = Math.max(
                    0,
                    (averageDailyUsage * daysToOrder * seasonalFactor) + safetyStock - item.currentStock
                );

                // Determine priority based on top items and other factors
                const isTopItem = topItems.includes(item.name);
                const priority = isTopItem
                    ? 'critical' // Top items are always critical
                    : this.calculateOrderPriority(item, expiringItems);

                if (recommendedQuantity > 0 || expiringItems.length > 0) {
                    recommendations.push({
                        ingredientId: doc.id,
                        ingredientName: item.name,
                        currentStock: item.currentStock,
                        recommendedQuantity: Math.ceil(recommendedQuantity),
                        urgency: priority,
                        expiringItems: expiringItems.length,
                        nextExpirationDate: expiringItems[0]?.expirationDate || null
                    });
                }
            }

            // Sort recommendations: top items first, then by urgency
            recommendations.sort((a, b) => {
                if (a.urgency !== b.urgency) {
                    return b.urgency === 'critical' ? 1 : -1;
                }
                return topItems.includes(b.ingredientName) - topItems.includes(a.ingredientName);
            });

            return {
                success: true,
                data: recommendations,
                message: 'Order recommendations generated successfully'
            };
        } catch (error) {
            console.error('Error generating order recommendations:', error.message);
            return { success: false, error: error.message };
        }
    }
    async calculateOverallConfidence(predictions) {
        const confidences = Object.values(predictions).map(p => p.confidence);
        return confidences.reduce((a, b) => a + b, 0) / confidences.length;
    }

    async calculateItemConfidence(data, predictions) {
        const dataPoints = data.historicalUsage?.length || 0;
        const variability = this.calculateVariability(predictions);
        return Math.min(1, (dataPoints / 100) * (1 - variability));
    }

    async calculateBaseQuantity(historicalUsage) {
        if (!historicalUsage?.length) return 0;
        const recentUsage = historicalUsage.slice(-14);
        return recentUsage.reduce((sum, usage) => sum + usage.quantity, 0) / 14;
    }

    async calculateHolidayFactor(date, holidays) {
        const upcomingHolidays = holidays.filter(h => {
            const holidayDate = new Date(h.date);
            const daysDiff = (holidayDate - date) / (1000 * 60 * 60 * 24);
            return daysDiff >= 0 && daysDiff <= 14;
        });
        return upcomingHolidays.length > 0 ? 1.3 : 1.0;
    }

    async predictWeatherImpact(date, weatherPatterns) {
        // Fetch weather data for the given date
        const weatherData = await this.getWeatherData(date);

        // Find the weather forecast for the specific date
        const forecast = weatherData.find(w => new Date(w.date).toDateString() === date.toDateString());

        if (!forecast) return 1.0; // Return default neutral impact if no forecast is found

        // Apply weather impact logic
        if (forecast.conditions.includes('rain')) return 0.9; // Rain reduces demand
        if (forecast.temperature > 30) return 0.8; // Hot weather reduces demand
        if (forecast.temperature < 10) return 1.2; // Cold weather increases demand

        return 1.0; // Default neutral impact
    }


    calculateOrderPriority(item, expiringItems) {
        if (item.currentStock <= 0) return 'critical';
        if (item.currentStock < item.minStockLevel) return 'high';
        if (expiringItems.length > 0) return 'medium';
        return 'normal';
    }

    getStartDate(timeRange) {
        const now = new Date();
        switch(timeRange) {
            case 'daily':
                return new Date(now.setHours(0,0,0,0));
            case 'monthly':
                return new Date(now.setMonth(now.getMonth() - 1));
            case 'yearly':
                return new Date(now.setFullYear(now.getFullYear() - 1));
            default:
                return null;
        }
    }

    async getUsageHistory(userId, ingredientId) {
        const salesReports  = await db
            .collection('users').doc(userId)
            .collection('reports').doc('sales')
            .collection('salesReports')
            .where('status', '==', 'submitted')
            .orderBy('date', 'desc')
            .limit(30)
            .get();

        return salesReports.docs.map(doc => doc.data());
    }


    async analyzeData(userId, historicalData) {
        const holidays = new Holidays('IL');
        const currentDate = new Date();
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const predictions = {};

        for (const data of historicalData) {
            const itemAnalysis = await this.analyzeItem(data, holidays, currentDate, endDate);
            predictions[data.id] = itemAnalysis;
        }

        return {
            data: predictions,
            metadata: {
                analyzedAt: currentDate,
                forecastPeriod: {
                    start: currentDate,
                    end: endDate
                },
                confidence: this.calculateOverallConfidence(predictions)
            }
        };
    }

    async analyzeItem(data, holidays, startDate, endDate) {
        const dailyPredictions = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const prediction = {
                date: new Date(currentDate),
                quantity: await this.predictQuantity(data, currentDate, holidays),
                factors: {
                    seasonal: this.calculateSeasonalFactor(currentDate),
                    holiday: this.calculateHolidayFactor(currentDate, holidays),
                    weather: await this.predictWeatherImpact(currentDate, data.weatherPatterns)
                }
            };

            dailyPredictions.push(prediction);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return {
            predictions: dailyPredictions,
            trends: this.analyzeTrends(dailyPredictions),
            confidence: this.calculateItemConfidence(data, dailyPredictions)
        };
    }

    async predictQuantity(itemData, date, holidays) {
        const baseQuantity = this.calculateBaseQuantity(itemData.historicalUsage);
        const seasonalFactor = this.calculateSeasonalFactor(date);
        const holidayFactor = this.calculateHolidayFactor(date, holidays);
        const weatherFactor = await this.predictWeatherImpact(date, itemData.weatherPatterns);

        return Math.ceil(baseQuantity * seasonalFactor * holidayFactor * weatherFactor);
    }

    analyzeTrends(predictions) {
        return {
            overall: this.calculateTrend(predictions.map(p => p.quantity)),
            byFactor: {
                seasonal: this.calculateTrend(predictions.map(p => p.factors.seasonal)),
                holiday: this.calculateTrend(predictions.map(p => p.factors.holiday)),
                weather: this.calculateTrend(predictions.map(p => p.factors.weather))
            },
            weatherImpact: this.calculateTrend(predictions.map(p => p.weatherData.temperature)) // Analyze temperature impact
        };
    }


    calculateTrend(values) {
        const n = values.length;
        if (n < 2) return 0;

        const xMean = (n - 1) / 2;
        const yMean = values.reduce((a, b) => a + b) / n;

        let numerator = 0;
        let denominator = 0;

        for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (values[i] - yMean);
            denominator += Math.pow(i - xMean, 2);
        }

        return denominator === 0 ? 0 : numerator / denominator;
    }
    getUpcomingHolidays() {
        try {
            const hd = new Holidays('IL');
            const now = new Date();
            const endDate = new Date();
            endDate.setDate(now.getDate() + 14);

            const holidays = hd.getHolidays(now, endDate);

            return holidays.filter(holiday =>
                holiday.type === 'public' ||
                holiday.type === 'jewish'
            );
        } catch (error) {
            console.error('Error initializing holidays library:', error);
            return []; // Return empty array to prevent calculations from breaking
        }
    }

    calculateVariability(predictions) {
        const values = predictions.map(p => p.quantity);
        const mean = values.reduce((a, b) => a + b, 0) / values.length;
        const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
        return Math.sqrt(variance) / mean;
    }

    calculateSeasonalFactor(category) {
        const currentMonth = new Date().getMonth();
        const holidays = this.getUpcomingHolidays();

        let factor = 1.0;

        if (holidays.length > 0) {
            // Higher factor for major holidays
            const majorHolidays = holidays.filter(h =>
                h.name.includes('Rosh Hashana') ||
                h.name.includes('Passover') ||
                h.name.includes('Sukkot')
            );
            factor *= majorHolidays.length > 0 ? 1.5 : 1.3;
        }
        switch(category.toLowerCase()) {
            case 'beverages':
                factor *= (currentMonth >= 5 && currentMonth <= 8) ? 1.4 : 1.0;
                break;
            case 'desserts':
                factor *= holidays.length > 0 ? 1.5 : 1.0;
                break;
        }

        return factor;
    }
}

export default new AnalyticsService();