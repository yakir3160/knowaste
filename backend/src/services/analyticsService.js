import { db } from '../../config/firebase-admin.js';
import Holidays from 'date-holidays';
import axios from "axios";

class AnalyticsService {

    validateInput(userId, methodName, additionalChecks = {}) {
        if (!userId) throw new Error(`${methodName}: User ID required`);

        Object.entries(additionalChecks).forEach(([param, value]) => {
            if (!value) throw new Error(`${methodName}: ${param} required`);
        });
    }

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

        this.validateInput(userId, 'getHistoricalData');
        console.log('Fetching historical data...');

        const salesQuery = await db
            .collection('users').doc(userId)
            .collection('reports').doc('sales')
            .collection('salesReports')
            .orderBy('date', 'desc')
            .limit(365)
            .get();
        console.log('Sales data fetched:', salesQuery.docs.length);
        return salesQuery.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
             date: doc.data().date
        }));
    }

    async getCurrentData(userId, date) {

        this.validateInput(userId, 'getCurrentData', { date });

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
            if (!process.env.OPENWEATHER_API_KEY && (address || city)) {
                throw new Error('Weather API key required for location-based forecasts');
            }

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
            console.error('Weather API error:', error.message);
            return {
                temperature: 25,
                humidity: 60,
                conditions: 'unknown'
            };
        }
    }

    async calculateSalesAnalytics(userId, startDate, endDate) {
        this.validateInput(userId, 'calculateSalesAnalytics', { startDate, endDate });

        try {
            // Create the base query
            let salesQuery = db
                .collection('users').doc(userId)
                .collection('reports').doc('sales')
                .collection('salesReports')
                // Add date range filters
                .where('date', '>=', new Date(startDate))
                .where('date', '<=', new Date(endDate));

            const snapshot = await salesQuery.get();
            const sales = snapshot.docs.map(doc => doc.data());

            const analytics = {
                totalRevenue: 0,
                itemsSold: {},
                topItems: [],
                averageOrderValue: 0,
                startDate: startDate,
                endDate: endDate
            };

            sales.forEach(sale => {
                sale.items.forEach(item => {
                    analytics.totalRevenue += item.totalPrice;
                    analytics.itemsSold[item.menuItem] = (analytics.itemsSold[item.menuItem] || 0) + item.quantity;
                })
            });

            analytics.topItems = Object.entries(analytics.itemsSold)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5);
            analytics.averageOrderValue = analytics.totalRevenue / sales.length || 0;

            return {
                success: true,
                data: analytics,
                message: 'Sales analytics calculated successfully'
            };

        } catch (error) {
            console.error('Error calculating sales analytics:', error);
            return { success: false, error: error.message };
        }
    }

    async analyzeWaste(userId, timeRange, startDate, endDate) {

        this.validateInput(userId, 'analyzeWaste', {
            timeRange,
            ...(timeRange === 'custom' ? { startDate, endDate } : {})
        });

        try {
            let wasteQuery = db
                .collection('users').doc(userId)
                .collection('reports').doc('waste')
                .collection('wasteReports')

            if (timeRange === 'custom' && startDate && endDate) {
                wasteQuery = wasteQuery
                    .where('date', '>=', new Date(startDate))
                    .where('date', '<=', new Date(endDate));
            } else {
                const queryStartDate = this.getStartDate(timeRange);
                if (queryStartDate) {
                    wasteQuery = wasteQuery.where('date', '>=', queryStartDate);
                }
            }

            const snapshot = await wasteQuery.get();
            const wasteReports = snapshot.docs.map(doc => doc.data());

            const analysis = {
                totalWasteCost: 0,
                wasteByReason: {},
                wasteByIngredient: {},
                topWastedIngredients: [],
                trends: this.calculateWasteTrends(wasteReports),
                periodAnalysis: this.analyzePeriodTrends(wasteReports)
            };

            wasteReports.forEach(report => {
                report.items.forEach(item => {
                    analysis.totalWasteCost += item.cost;
                    analysis.wasteByReason[item.reason] = (analysis.wasteByReason[item.reason] || 0) + item.cost;
                    analysis.wasteByIngredient[item.ingredientId] = {
                        name: item.ingredientName,
                        cost: (analysis.wasteByIngredient[item.ingredientId]?.cost || 0) + item.cost,
                        quantity: (analysis.wasteByIngredient[item.ingredientId]?.quantity || 0) + item.quantity
                    };
                });
            });

            analysis.topWastedIngredients = Object.entries(analysis.wasteByIngredient)
                .sort(([, a], [, b]) => b.cost - a.cost)
                .slice(0, 10)
                .map(([id, data]) => ({
                    id,
                    ...data
                }));

            return {
                success: true,
                data: analysis,
                message: 'Waste analysis calculated successfully'
            };
        } catch (error) {
            throw new Error(`Error analyzing waste: ${error.message}`);
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

    async generateRecommendations(userId, averageDailyUsage, daysToOrder, safetyStock) {

        this.validateInput(userId, 'generateRecommendations', {
            averageDailyUsage,
            daysToOrder,
            safetyStock
        });

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
        this.validateInput(userId, 'generateOrderRecommendations');

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
                const seasonalFactor = this.calculateSeasonalFactor(item.categoryName, new Date());
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
        const weatherData = await this.getWeatherData(date);
        const forecast = weatherData.find(w => new Date(w.date).toDateString() === date.toDateString());

        if (!forecast) return 1.0;

        let impact = 1.0;
        // Temperature impact
        if (forecast.temperature > 35) impact *= 0.7;  // Very hot
        else if (forecast.temperature > 30) impact *= 0.8;  // Hot
        else if (forecast.temperature < 5) impact *= 1.3;   // Very cold
        else if (forecast.temperature < 10) impact *= 1.2;  // Cold

        // Weather conditions impact
        if (forecast.conditions.includes('rain')) impact *= 0.9;
        if (forecast.conditions.includes('snow')) impact *= 1.2;

        return impact;
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

        this.validateInput(userId, 'getUsageHistory', { ingredientId });

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
                    seasonal: this.calculateSeasonalFactor(data.categoryName, currentDate),
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
        const seasonalFactor = this.calculateSeasonalFactor(itemData.categoryName, date);
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
                weather: this.calculateTrend(predictions.map(p => p.factors?.weather || 1.0))
            }
        };
    }

    analyzePeriodTrends(data) {
        const dailyTrends = {};
        const weeklyTrends = {};
        const monthlyTrends = {};

        data.forEach(item => {
            const date = new Date(item.date);
            const dayKey = date.toISOString().split('T')[0];
            const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
            const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

            const metrics = {
                cost: item.cost || 0,
                quantity: item.quantity || 0
            };

            dailyTrends[dayKey] = this.aggregateMetrics(dailyTrends[dayKey], metrics);
            weeklyTrends[weekKey] = this.aggregateMetrics(weeklyTrends[weekKey], metrics);
            monthlyTrends[monthKey] = this.aggregateMetrics(monthlyTrends[monthKey], metrics);
        });

        return {
            daily: dailyTrends,
            weekly: weeklyTrends,
            monthly: monthlyTrends
        };
    }

    aggregateMetrics(existing = { cost: 0, quantity: 0 }, current) {
        return {
            cost: existing.cost + current.cost,
            quantity: existing.quantity + current.quantity
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

    calculateSeasonalFactor(category, date = new Date()) {
        const currentMonth = date.getMonth();
        const holidays = this.getUpcomingHolidays();

        let factor = this.calculateHolidayImpact(holidays);
        factor *= this.calculateSeasonalImpact(category, currentMonth);

        return factor;
    }

    calculateHolidayImpact(holidays) {
        if (!holidays.length) return 1.0;
        const majorHolidays = holidays.filter(h =>
            ['Rosh Hashana', 'Passover', 'Sukkot'].some(holiday =>
                h.name.includes(holiday))
        );
        return majorHolidays.length > 0 ? 1.5 : 1.3;
    }

    calculateSeasonalImpact(category, month) {
        const seasons = {
            beverages: month >= 5 && month <= 8 ? 1.4 : 1.0,
            desserts: month >= 11 || month <= 1 ? 1.3 : 1.0,
            soups: month >= 11 || month <= 2 ? 1.5 : 1.0,
            salads: month >= 5 && month <= 8 ? 1.3 : 1.0
        };
        return seasons[category.toLowerCase()] || 1.0;
    }


    async fetchSalesByDateRange(userId, startDate, endDate) {
        try {
            console.log('Fetching sales data...');
            console.log('startDate:', startDate);
            console.log('endDate:', endDate);
            const salesQuery = await db
                .collection('users').doc(userId)
                .collection('reports').doc('sales')
                .collection('salesReports')
                .where('date', '>=', new Date(startDate))
                .where('date', '<=', new Date(endDate))
                .get();

            const sales = salesQuery.docs.map(doc => doc.data());
            console.log('Sales fetched:', sales.length);

            return {
                success: true,
                data: sales,
                summary: this.calculateSalesSummary(sales)
            };
        } catch (error) {
            throw new Error(`Error fetching sales: ${error.message}`);
        }
    }
    async calculateTopSellingDishes(userId, startDate, endDate) {
        try {
            console.log('Calculating top dishes...');

            // Fetch sales data
            const salesData = await this.getHistoricalData(userId);
            console.log('sales data',salesData)

            // Filter sales data by the specified timeframe
            const filteredSales = this.filterByTimeframe(salesData, startDate, endDate);
            // Aggregate sales data by dish
            const dishSales = {};
            filteredSales.forEach(sale => {
                sale.items.forEach(item => {
                    const menuItem = item.menuItem || item.name; // Handle potential alternate field names
                    dishSales[menuItem] = (dishSales[menuItem] || 0) + (item.quantity || 1);
                });
            });

            // Sort and retrieve top 10 dishes
            const topDishes = Object.entries(dishSales)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([dish, quantity]) => ({ dish, quantity }));
            console.log('Top Dishes:', topDishes);

            return {
                success: true,
                data: topDishes,
                timeframe: startDate, endDate
            };
        } catch (error) {
            console.error('Error calculating top dishes:', error.message);
            throw new Error(`Error calculating top dishes: ${error.message}`);
        }
    }
     filterByTimeframe(salesData, startDate, endDate) {
        console.log('Filtering sales data...');
        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);
        console.log('startDateTime:', startDateTime);
        console.log('endDateTime:', endDateTime);

        return salesData.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= startDateTime && saleDate <= endDateTime;
        });
    }


    async calculateLeastSellingDishes(userId, startDate, endDate) {
        try {
            const salesData = await this.getHistoricalData(userId);
            const dishSales = {};
            const filteredItems = this.filterByTimeframe(salesData, startDate, endDate)
            filteredItems.forEach(sale => {
                sale.items.forEach(item => {
                    dishSales[item.menuItem] = (dishSales[item.menuItem] || 0) + item.quantity;
                });
            });


            const leastSold = Object.entries(dishSales)
                .sort(([, a], [, b]) => a - b)
                .slice(0, 10)
                .map(([dish, quantity]) => ({ dish, quantity }));

            return {
                success: true,
                data: leastSold
            };
        } catch (error) {
            throw new Error(`Error calculating least selling dishes: ${error.message}`);
        }
    }


    async fetchTopWastedIngredients(userId) {
        try {
            const wasteData = await this.getWasteHistory(userId);
            const ingredientWaste = {};

            wasteData.forEach(report => {
                report.items.forEach(item => {
                    ingredientWaste[item.ingredientId] = {
                        name: item.ingredientName,
                        quantity: (ingredientWaste[item.ingredientId]?.quantity || 0) + item.quantity,
                        cost: (ingredientWaste[item.ingredientId]?.cost || 0) + item.cost
                    };
                });
            });

            const topWasted = Object.entries(ingredientWaste)
                .sort(([, a], [, b]) => b.cost - a.cost)
                .slice(0, 10)
                .map(([id, data]) => ({ id, ...data }));

            return {
                success: true,
                data: topWasted
            };
        } catch (error) {
            throw new Error(`Error fetching top wasted ingredients: ${error.message}`);
        }
    }

    async fetchNonProfitableItems(userId) {
        try {
            const [salesData, costData] = await Promise.all([
                this.getHistoricalData(userId),
                this.getIngredientCosts(userId)
            ]);

            const itemProfitability = {};

            salesData.forEach(sale => {
                sale.items.forEach(item => {
                    if (!itemProfitability[item.id]) {
                        itemProfitability[item.id] = {
                            name: item.menuItem,
                            revenue: 0,
                            cost: 0,
                            sales: 0
                        };
                    }
                    itemProfitability[item.id].revenue += item.totalPrice;
                    itemProfitability[item.id].sales += item.quantity;
                    itemProfitability[item.id].cost += this.calculateItemCost(item, costData);
                });
            });

            const nonProfitable = Object.entries(itemProfitability)
                .map(([id, data]) => ({
                    id,
                    ...data,
                    profit: data.revenue - data.cost,
                    margin: ((data.revenue - data.cost) / data.revenue) * 100
                }))
                .filter(item => item.margin < 15) // Items with less than 15% profit margin
                .sort((a, b) => a.margin - b.margin);

            return {
                success: true,
                data: nonProfitable
            };
        } catch (error) {
            throw new Error(`Error fetching non-profitable items: ${error.message}`);
        }
    }

    async fetchLowStockItems(userId) {
        try {
            const inventorySnapshot = await db
                .collection('users').doc(userId)
                .collection('inventoryItems')
                .get();

            const lowStockItems = inventorySnapshot.docs
                .map(doc => {
                    const data = doc.data();
                    return {
                        id: data.ingredientId,
                        name: data.name,
                        currentStock: data.currentStock,
                        minStockLevel: data.minStockLevel,
                        stockDeficit: data.minStockLevel - data.currentStock
                    };
                })
                .filter(item => item.currentStock <= item.minStockLevel)
                .sort((a, b) => b.stockDeficit - a.stockDeficit);

            return {
                success: true,
                data: lowStockItems
            };
        } catch (error) {
            throw new Error(`Error fetching low stock items: ${error.message}`);
        }
    }

    async calculateRevenueVsWaste(userId, startDate, endDate) {


        this.validateInput(userId, 'calculateRevenueVsWaste', { startDate, endDate });

        try {
            const [salesData, wasteData] = await Promise.all([
                this.calculateSalesAnalytics(userId, startDate, endDate),
                this.analyzeWaste(userId, startDate, endDate)
            ]);

            const analysis = {
                totalRevenue: salesData.data.totalRevenue,
                totalWaste: wasteData.data.totalWasteCost,
                wastePercentage: (wasteData.data.totalWasteCost / salesData.data.totalRevenue) * 100,
                periodSummary: {
                    sales: salesData.data,
                    waste: wasteData.data
                }
            };

            return {
                success: true,
                data: analysis
            };
        } catch (error) {
            throw new Error(`Error calculating revenue vs waste: ${error.message}`);
        }
    }

    async forecastDemand(userId) {
        try {
            const historicalData = await this.getHistoricalData(userId);
            const itemDemand = {};

            // Group sales by item and calculate trends
            historicalData.forEach(sale => {
                sale.items.forEach(item => {
                    if (!itemDemand[item.id]) {
                        itemDemand[item.id] = {
                            name: item.menuItem,
                            dailySales: [],
                            seasonalFactors: {},
                            forecast: {}
                        };
                    }
                    itemDemand[item.id].dailySales.push({
                        date: sale.date,
                        quantity: item.quantity
                    });
                });
            });
            console.log('Item demand:', itemDemand);

            // Calculate forecast for each item
            for (const [itemId, data] of Object.entries(itemDemand)) {
                const forecast = await this.predictQuantity({
                    historicalUsage: data.dailySales,
                    itemId: itemId
                }, new Date(), new Holidays('IL'));

                itemDemand[itemId].forecast = forecast;
            }

            return {
                success: true,
                data: itemDemand
            };
        } catch (error) {
            throw new Error(`Error forecasting demand: ${error.message}`);
        }
    }

    async calculateItemCost(item, costData) {
        // Helper method for fetchNonProfitableItems
        try {
            return item.ingredients.reduce((total, ingredient) => {
                const cost = costData[ingredient.id]?.pricePerUnit || 0;
                return total + (cost * ingredient.quantity);
            }, 0);
        } catch (error) {
            throw new Error(`Error calculating item cost: ${error.message}`);
        }
    }

    async getIngredientCosts(userId) {
        // Helper method for fetchNonProfitableItems
        try {
            const ingredientsSnapshot = await db
                .collection('inventory')
                .doc(userId)
                .collection('inventoryItems')
                .get();

            const costs = {};
            ingredientsSnapshot.docs.forEach(doc => {
                const data = doc.data();
                costs[doc.id] = {
                    pricePerUnit: data.pricePerUnit,
                    unit: data.unit
                };
            });

            return costs;
        } catch (error) {
            throw new Error(`Error getting ingredient costs: ${error.message}`);
        }
    }

    async getWasteHistory(userId) {
        // Helper method for fetchTopWastedIngredients
        try {
            const wasteSnapshot = await db
                .collection('users').doc(userId)
                .collection('reports').doc('waste')
                .collection('wasteReports')
                .orderBy('date', 'desc')
                .limit(90) // Last 3 months
                .get();

            return wasteSnapshot.docs.map(doc => doc.data());
        } catch (error) {
            throw new Error(`Error getting waste history: ${error.message}`);
        }
    }

    calculateWasteTrends(wasteData) {
        // Helper method for analyzeWaste
        try {
            const trends = {
                daily: {},
                weekly: {},
                monthly: {}
            };

            wasteData.forEach(report => {
                const date = new Date(report.date);
                const dayKey = date.toISOString().split('T')[0];
                const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
                const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

                trends.daily[dayKey] = (trends.daily[dayKey] || 0) + report.summary.totalCost;
                trends.weekly[weekKey] = (trends.weekly[weekKey] || 0) + report.summary.totalCost;
                trends.monthly[monthKey] = (trends.monthly[monthKey] || 0) + report.summary.totalCost;
            });

            return trends;
        } catch (error) {
            throw new Error(`Error calculating waste trends: ${error.message}`);
        }
    }

    calculateSalesSummary(sales) {
        const summary = {
            totalSales: 0,
            totalItems: 0,
            avgOrderValue: 0
        };

        sales.forEach(sale => {
            sale.items.forEach(item => {
                summary.totalSales += item.totalPrice;
                summary.totalItems += item.quantity;
            });
        });

        summary.avgOrderValue = sales.length ? summary.totalSales / sales.length : 0;
        return summary;
    }
}

export default new AnalyticsService();