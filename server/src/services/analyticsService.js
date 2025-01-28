import { db } from '../../config/firebase-admin.js';
import Holidays from 'date-holidays';
import axios from "axios";


const fetchBaseData = async (userId, startDate, endDate) => {
    try {
        console.log('Fetching base data with params:', { userId, startDate, endDate });

        // Convert dates to Firestore Timestamp
        const startTimestamp = new Date(startDate);
        const endTimestamp = new Date(endDate);

        console.log('Using timestamps:', { startTimestamp, endTimestamp });

        const queries = await Promise.all([
            db.collection('users').doc(userId)
                .collection('reports').doc('sales')
                .collection('salesReports')
                .where('date', '>=', startTimestamp)
                .where('date', '<=', endTimestamp)
                .get(),
            db.collection('users').doc(userId)
                .collection('reports').doc('waste')
                .collection('wasteReports')
                .where('date', '>=', startTimestamp)
                .where('date', '<=', endTimestamp)
                .get(),
            db.collection('users').doc(userId)
                .collection('inventoryItems')
                .get()
        ]);

        const [salesQuery, wasteQuery, inventoryQuery] = queries;

        console.log('Query results:', {
            salesCount: salesQuery.docs.length,
            wasteCount: wasteQuery.docs.length,
            inventoryCount: inventoryQuery.docs.length
        });

        console.log('Sales data:', salesQuery.docs.map(doc => doc.data()));
        console.log('Waste data:', wasteQuery.docs.map(doc => doc.data()));
        console.log('Inventory data:', inventoryQuery.docs.map(doc => doc.data()));

        return {
            sales: salesQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date instanceof Date ? doc.data().date : doc.data().date.toDate()
            })),
            waste: wasteQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date instanceof Date ? doc.data().date : doc.data().date.toDate()
            })),
            inventory: inventoryQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
        };
    } catch (error) {
        console.error('Error in fetchBaseData:', error);
        throw new Error(`Error fetching base data: ${error.message}`);
    }
};

const generateAllAnalytics = async (baseData) => {
    const { sales, waste, inventory } = baseData;

    console.log('Generating analytics with base data:');
    console.log('Sales:', sales);
    console.log('Waste:', waste);
    console.log('Inventory:', inventory);

    const calculateTotals = (items, field) => items.reduce((sum, item) => sum + (item[field] || 0), 0);
    const aggregateItems = (items, key, fields) => {
        const result = {};
        items.forEach(item => {
            const entry = result[item[key]] || fields.reduce((obj, field) => ({ ...obj, [field]: 0 }), {});
            fields.forEach(field => entry[field] += item[field] || 0);
            result[item[key]] = entry;
        });
        return result;
    };

    const salesAnalytics = {
        totalRevenue: calculateTotals(sales, 'summary.totalSales'),
        itemsSold: aggregateItems(sales.flatMap(sale => sale.items), 'menuItem', ['quantity'])
    };

    console.log('Sales analytics:', salesAnalytics);

    const sortedItems = Object.entries(salesAnalytics.itemsSold)
        .map(([key, value]) => ({ menuItem: key, quantity: value.quantity }))
        .sort((a, b) => b.quantity - a.quantity);

    const wasteAnalytics = {
        totalWasteCost: calculateTotals(waste, 'summary.totalCost'),
        wasteByIngredient: aggregateItems(waste.flatMap(report => report.items), 'ingredientId', ['quantity', 'cost'])
    };

    console.log('Waste analytics:', wasteAnalytics);

    return {
        salesAnalytics: {
            ...salesAnalytics,
            topSellingDishes: sortedItems.slice(0, 10),
            leastSellingDishes: sortedItems.slice(-10)
        },
        wasteAnalytics: {
            ...wasteAnalytics,
            topWastedIngredients: Object.entries(wasteAnalytics.wasteByIngredient)
                .sort(([, a], [, b]) => b.cost - a.cost)
                .slice(0, 10)
                .map(([id, data]) => ({ id, ...data }))
        },
        inventoryAnalytics: {
            lowStockItems: inventory.filter(item => item.currentStock <= item.minStockLevel)
                .map(item => ({
                    id: item.ingredientId,
                    name: item.name,
                    currentStock: item.currentStock,
                    minStockLevel: item.minStockLevel,
                    stockDeficit: item.minStockLevel - item.currentStock
                }))
                .sort((a, b) => b.stockDeficit - a.stockDeficit)
        },
        revenueVsWaste: {
            totalRevenue: salesAnalytics.totalRevenue,
            totalWaste: wasteAnalytics.totalWasteCost,
            wastePercentage: (wasteAnalytics.totalWasteCost / salesAnalytics.totalRevenue) * 100
        }
    };
};


class AnalyticsService {

    validateInput(userId, methodName, additionalChecks = {}) {

        console.log(`Validating input for ${methodName} method...`);

        if (!userId)
            throw new Error(`${methodName}: User ID required`);

        Object.entries(additionalChecks).forEach(([param, value]) => {
            if (!value) throw new Error(`${methodName}: ${param} required`);
        });

        console.log('Input validation passed.');
    }

    async getHistoricalData(userId) {

        console.log('Fetching historical data...');

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

        const salesData = salesQuery.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date
        }));


        return salesData;
    }

    async getWeatherData(date, user) {
        try {
            const { address, city } = user;

            console.log(`Fetching weather data for ${address}, ${city} on ${date.toISOString()}`);

            if (!address || !city) {
                console.warn('User location not set, using default weather patterns');
                return this.getHistoricalWeatherPattern(date);
            }

            if (!process.env.OPENWEATHER_API_KEY) {
                console.warn('No OpenWeather API key found, using historical weather patterns');
                return this.getHistoricalWeatherPattern(date);
            }

            const apiKey = process.env.OPENWEATHER_API_KEY;

            // Cache key based on location and date
            const cacheKey = `weather_${address}_${city}_${date.toISOString().split('T')[0]}`;

            // Try to get cached weather data first
            try {
                const cachedData = await db.collection('weatherCache')
                    .doc(cacheKey)
                    .get();

                if (cachedData.exists) {
                    const data = cachedData.data();
                    // Only use cache if it's less than 3 hours old
                    if (Date.now() - data.timestamp < 3 * 60 * 60 * 1000) {
                        console.log('Using cached weather data');
                        return data.forecast;
                    }
                }
            } catch (error) {
                console.error('Cache read error:', error);
            }

            // Get coordinates
            const geoResponse = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
                params: {
                    q: `${address}, ${city}, Israel`,
                    limit: 1,
                    appid: apiKey
                }
            });

            if (geoResponse.data.length === 0) {
                console.log('No location found, using historical weather patterns');
                return this.getHistoricalWeatherPattern(date);
            }

            const { lat, lon } = geoResponse.data[0];

            // Get 5-day forecast
            const forecastResponse = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    lat,
                    lon,
                    appid: apiKey,
                    units: 'metric'
                }
            });

            const processedForecast = forecastResponse.data.list.map(entry => ({
                date: entry.dt_txt,
                temperature: entry.main.temp,
                feelsLike: entry.main.feels_like,
                humidity: entry.main.humidity,
                conditions: entry.weather[0]?.description || 'unknown',
                windSpeed: entry.wind.speed,
                precipitation: entry.rain?.['3h'] || 0,
                businessImpact: this.calculateWeatherImpact(
                    entry.main.temp,
                    entry.main.feels_like,
                    entry.weather[0]?.main,
                    entry.wind.speed,
                    entry.rain?.['3h'] || 0
                )
            }));

            // Cache the result
            try {
                await db.collection('weatherCache')
                    .doc(cacheKey)
                    .set({
                        forecast: processedForecast,
                        timestamp: Date.now(),
                        location: {
                            address,
                            city,
                            coordinates: { lat, lon }
                        }
                    });
                console.log('Weather data cached');
            } catch (error) {
                console.error('Cache write error:', error);
            }

            console.log('Weather data fetched and processed');
            return processedForecast;

        } catch (error) {
            console.error('Weather API error:', error.message);
            return this.getHistoricalWeatherPattern(date);
        }
    }

    getHistoricalWeatherPattern(date) {
        const month = date.getMonth();

        console.log(`Generating historical weather pattern for month ${month}`);

        // Israeli weather patterns by season
        const patterns = {
            winter: {  // December-February (months 11,0,1)
                baseTemp: 13,
                minTemp: 8,
                maxTemp: 18,
                conditions: 'partly cloudy',
                rainChance: 0.4,  // 40% chance of rain
                humidity: 70,
                businessImpact: 0.8  // Reduced visitors in winter
            },
            spring: {  // March-May (months 2,3,4)
                baseTemp: 20,
                minTemp: 15,
                maxTemp: 25,
                conditions: 'clear',
                rainChance: 0.2,
                humidity: 60,
                businessImpact: 1.2  // Good weather brings more visitors
            },
            summer: {  // June-August (months 5,6,7)
                baseTemp: 30,
                minTemp: 24,
                maxTemp: 35,
                conditions: 'clear',
                rainChance: 0,
                humidity: 65,
                businessImpact: 1.0  // Normal flow, affected by AC
            },
            autumn: {  // September-November (months 8,9,10)
                baseTemp: 23,
                minTemp: 18,
                maxTemp: 28,
                conditions: 'partly cloudy',
                rainChance: 0.2,
                humidity: 65,
                businessImpact: 1.1  // Pleasant weather
            }
        };

        // Determine season based on month
        let season;
        if (month >= 11 || month <= 1) season = patterns.winter;
        else if (month >= 2 && month <= 4) season = patterns.spring;
        else if (month >= 5 && month <= 7) season = patterns.summer;
        else season = patterns.autumn;

        console.log(`Determined season: ${Object.keys(patterns).find(key => patterns[key] === season)}`);

        // Add some randomization to make it more realistic
        const randomizeTemp = (base, min, max) => {
            const temp = base + (Math.random() * 4 - 2); // ±2 degrees variation
            return Math.min(Math.max(temp, min), max);
        };

        const temp = randomizeTemp(season.baseTemp, season.minTemp, season.maxTemp);
        const isRaining = Math.random() < season.rainChance;
        const actualConditions = isRaining ? 'rain' : season.conditions;

        console.log(`Calculated weather conditions: 
        Temperature: ${temp}°C
        Feels like: ${temp + (isRaining ? -1 : 1)}°C
        Conditions: ${actualConditions}
        Humidity: ${season.humidity + (Math.random() * 10 - 5)}%
        Wind speed: ${5 + (Math.random() * 10)} km/h
        Precipitation: ${isRaining ? `${2 + (Math.random() * 3)} mm` : '0 mm'}
    `);

        // Calculate business impact based on conditions
        let impact = season.businessImpact;

        // Modify impact based on specific conditions
        if (isRaining) impact *= 0.8;  // Rain reduces visitors
        if (temp > 32) impact *= 0.9;  // Very hot reduces visitors
        if (temp < 10) impact *= 0.9;  // Very cold reduces visitors
        if (temp >= 18 && temp <= 25) impact *= 1.1;  // Perfect weather increases visitors

        console.log(`Calculated business impact: ${impact}`);

        return {
            date: date.toISOString(),
            temperature: temp,
            feelsLike: temp + (isRaining ? -1 : 1),  // Feels colder in rain, warmer in sun
            humidity: season.humidity + (Math.random() * 10 - 5),  // ±5% variation
            conditions: actualConditions,
            windSpeed: 5 + (Math.random() * 10),  // 5-15 km/h wind
            precipitation: isRaining ? 2 + (Math.random() * 3) : 0,  // 2-5mm if raining
            businessImpact: impact,
            isHistoricalPattern: true  // Flag to indicate this is estimated data
        };
    }

    calculateWeatherImpact(temperature, feelsLikeTemp, weatherCondition, windSpeed, precipitation) {
        console.log(`Calculating weather impact with:
        Temperature: ${temperature}°C
        Feels like: ${feelsLikeTemp}°C
        Weather condition: ${weatherCondition}
        Wind speed: ${windSpeed} km/h
        Precipitation: ${precipitation} mm
    `);

        let impact = 1.0; // Default neutral impact

        // Temperature impact
        if (temperature > 35) impact *= 0.7;  // Very hot
        else if (temperature > 30) impact *= 0.8;  // Hot
        else if (temperature < 5) impact *= 1.3;   // Very cold
        else if (temperature < 10) impact *= 1.2;  // Cold

        // Comfort temperature (feels like)
        if (Math.abs(temperature - feelsLikeTemp) > 5) {
            impact *= 0.9; // Significant difference in actual vs feels like temp
        }

        // Weather conditions impact
        switch (weatherCondition) {
            case 'Rain':
                impact *= 0.7; // Rain significantly reduces business
                break;
            case 'Snow':
                impact *= 0.5; // Snow dramatically reduces business
                break;
            case 'Thunderstorm':
                impact *= 0.6; // Thunderstorms discourage visitors
                break;
        }

        // Wind impact
        if (windSpeed > 20) impact *= 0.8;  // High winds
        else if (windSpeed > 15) impact *= 0.9;  // Moderate winds

        // Precipitation impact
        if (precipitation > 10) impact *= 0.7;  // Heavy precipitation
        else if (precipitation > 5) impact *= 0.9;  // Moderate precipitation

        // Optimal temperature range
        if (temperature >= 18 && temperature <= 25) impact *= 1.2;  // Perfect weather increases impact

        console.log(`Calculated weather impact: ${impact}`);
        return Math.max(0.1, Math.min(1.5, impact));
    }

    async calculateSalesAnalytics(userId, startDate, endDate) {

        console.log(`Calculating sales analytics for user ${userId} from ${startDate} to ${endDate}`);

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

            console.log(`Fetched ${sales.length} sales records`);

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

            console.log(`Total revenue: $${analytics.totalRevenue}`);
            console.log('Items sold:', analytics.itemsSold);

            analytics.topItems = Object.entries(analytics.itemsSold)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([item, quantity]) => ({ item, quantity }));
            console.log('Top selling items:', analytics.topItems);

            analytics.averageOrderValue = analytics.totalRevenue / sales.length || 0;
            console.log(`Average order value: $${analytics.averageOrderValue}`);

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

    async analyzeWaste(userId, startDate, endDate) {
        console.log(`Analyzing waste for user ${userId} from ${startDate} to ${endDate}`);
        try {
            let wasteQuery = db
                .collection('users').doc(userId)
                .collection('reports').doc('waste')
                .collection('wasteReports')
                .where('date', '>=', new Date(startDate).toISOString())
                .where('date', '<=', new Date(endDate).toISOString());

            const snapshot = await wasteQuery.get();
            const wasteReports = snapshot.docs.map(doc => doc.data());

            console.log(`Fetched ${wasteReports.length} waste reports`);
            console.log('Waste data:', wasteReports);

            const analysis = {
                wasteReports,
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

            console.log(`Total waste cost: $${analysis.totalWasteCost}`);
            console.log('Waste by reason:', analysis.wasteByReason);
            // console.log('Waste by ingredient:', analysis.wasteByIngredient);

            analysis.topWastedIngredients = Object.entries(analysis.wasteByIngredient)
                .sort(([, a], [, b]) => b.cost - a.cost)
                .slice(0, 10)
                .map(([id, data]) => ({
                    id,
                    ...data
                }));

            // console.log('Top wasted ingredients:', analysis.topWastedIngredients);

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
        console.log(`Generating recommendations for user ${userId} with:
        Average daily usage: ${averageDailyUsage}
        Days to order: ${daysToOrder}
        Safety stock: ${safetyStock}
    `);

        this.validateInput(userId, 'generateRecommendations', {
            averageDailyUsage,
            daysToOrder,
            safetyStock
        });

        try {
            const weatherImpact = await this.predictWeatherImpact(new Date());
            const recommendedQuantity = Math.ceil(
                (averageDailyUsage * daysToOrder * weatherImpact) + safetyStock
            );

            console.log(`Recommended quantity: ${recommendedQuantity}`);

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
        console.log(`Generating order recommendations for user ${userId}`);

        this.validateInput(userId, 'generateOrderRecommendations');

        try {
            // Fetch inventory data
            const inventorySnapshot = await db
                .collection('inventory')
                .doc(userId)
                .collection('inventoryItems')
                .get();

            console.log(`Fetched ${inventorySnapshot.docs.length} inventory items`);

            // Fetch sales analytics to get top items
            const salesAnalytics = await this.calculateSalesAnalytics(userId, 'weekly');
            const topItems = salesAnalytics.data.topItems.map(item => item[0]); // Extract top item names
            console.log('Top selling items:', topItems);

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
                const seasonalFactor = this.calculateSeasonalImpact(item.categoryName, new Date());
                const averageDailyUsage = item.usageStats?.averageDailyUsage || 0;

                const demandVolatility = this.calculateDemandVolatility(
                    usageHistory.map(h => h.quantity)
                );
                console.log(`Demand volatility for ${item.name}: ${demandVolatility}`);

                const daysToOrder = 14;
                const safetyStock = item.minStockLevel || (averageDailyUsage * 7);
                const recommendedQuantity = Math.max(
                    0,
                    (averageDailyUsage * daysToOrder * seasonalFactor) + safetyStock - item.currentStock
                );
                console.log(`Recommended quantity for ${item.name}: ${recommendedQuantity}`);

                // Calculate estimated stockout
                const estimatedStockout = this.calculateEstimatedStockout(
                    item.currentStock,
                    item.usageStats?.averageDailyUsage || 0
                );
                console.log(`Estimated stockout for ${item.name}: ${estimatedStockout?.daysUntilStockout} days`);

                // Determine priority based on top items and other factors
                const isTopItem = topItems.includes(item.name);
                const priority = isTopItem
                    ? 'critical' // Top items are always critical
                    : this.calculateOrderPriority(item, expiringItems);
                console.log(`Priority for ${item.name}: ${priority}`);

                if (recommendedQuantity > 0 || expiringItems.length > 0) {
                    recommendations.push({
                        ingredientId: doc.id,
                        ingredientName: item.name,
                        currentStock: item.currentStock,
                        recommendedQuantity: Math.ceil(recommendedQuantity),
                        urgency: priority,
                        expiringItems: expiringItems.length,
                        nextExpirationDate: expiringItems[0]?.expirationDate || null,
                        demandVolatility: demandVolatility,
                        recommendationAdjustment: demandVolatility > 0.5 ? 'conservative' : 'standard',
                        estimatedStockout: estimatedStockout
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

            console.log('Generated order recommendations:', recommendations);

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

    async predictWeatherImpact(date) {
        console.log(`Predicting weather impact for date ${date.toISOString()}`);

        const weatherData = await this.getWeatherData(date);
        const forecast = weatherData.find(w => new Date(w.date).toDateString() === date.toDateString());

        if (!forecast) {
            console.log('No weather forecast available, returning neutral impact');
            return 1.0;
        }

        let impact = 1.0;
        // Temperature impact
        if (forecast.temperature > 35) {
            impact *= 0.7; // Very hot
            console.log('Temperature impact: 0.7 (Very hot)');
        } else if (forecast.temperature > 30) {
            impact *= 0.8; // Hot
            console.log('Temperature impact: 0.8 (Hot)');
        } else if (forecast.temperature < 5) {
            impact *= 1.3; // Very cold
            console.log('Temperature impact: 1.3 (Very cold)');
        } else if (forecast.temperature < 10) {
            impact *= 1.2; // Cold
            console.log('Temperature impact: 1.2 (Cold)');
        } else {
            console.log('Temperature impact: 1.0 (Neutral)');
        }

        // Weather conditions impact
        if (forecast.conditions.includes('rain')) {
            impact *= 0.9; // Rain reduces business
            console.log('Weather conditions impact: 0.9 (Rain)');
        } else if (forecast.conditions.includes('snow')) {
            impact *= 1.2; // Snow increases business
            console.log('Weather conditions impact: 1.2 (Snow)');
        } else {
            console.log('Weather conditions impact: 1.0 (Neutral)');
        }

        console.log(`Calculated weather impact: ${impact}`);
        return impact;
    }


    calculateOrderPriority(item, expiringItems) {
        console.log(`Calculating order priority for item ${item.name} with ${expiringItems.length} expiring items`);

        if (item.currentStock <= 0) {
            console.log('Priority: critical (out of stock)');
            return 'critical';
        }
        if (item.currentStock < item.minStockLevel) {
            console.log('Priority: high (low stock)');
            return 'high';
        }
        if (expiringItems.length > 0) {
            console.log('Priority: medium (items expiring)');
            return 'medium';
        }
        console.log('Priority: normal');
        return 'normal';
    }

    getStartDate(timeRange) {
        console.log(`Calculating start date for time range: ${timeRange}`);

        const now = new Date();
        switch(timeRange) {
            case 'daily':
                console.log('Start date: Today at 00:00:00');
                return new Date(now.setHours(0,0,0,0));
            case 'monthly':
                console.log('Start date: 1 month ago');
                return new Date(now.setMonth(now.getMonth() - 1));
            case 'yearly':
                console.log('Start date: 1 year ago');
                return new Date(now.setFullYear(now.getFullYear() - 1));
            default:
                console.log('Start date: No time range specified, returning null');
                return null;
        }
    }

    async getUsageHistory(userId, ingredientId) {
        console.log(`Fetching usage history for user ${userId} and ingredient ${ingredientId}`);

        this.validateInput(userId, 'getUsageHistory', { ingredientId });

        const salesReports = await db
            .collection('users').doc(userId)
            .collection('reports').doc('sales')
            .collection('salesReports')
            .where('status', '==', 'submitted')
            .orderBy('date', 'desc')
            .limit(30)
            .get();

        console.log(`Fetched ${salesReports.docs.length} sales reports`);

        return salesReports.docs.map(doc => doc.data());
    }


    analyzePeriodTrends(data) {
        console.log('Analyzing period trends');

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

        // console.log('Daily trends:', dailyTrends);
        // console.log('Weekly trends:', weeklyTrends);
        // console.log('Monthly trends:', monthlyTrends);

        return {
            daily: dailyTrends,
            weekly: weeklyTrends,
            monthly: monthlyTrends
        };
    }

    aggregateMetrics(existing = { cost: 0, quantity: 0 }, current) {
        // console.log('Aggregating metrics:', { existing, current });

        return {
            cost: existing.cost + current.cost,
            quantity: existing.quantity + current.quantity
        };
    }

    calculateTrend(values) {
        console.log('Calculating trend for values:', values);

        const n = values.length;
        if (n < 2) {
            console.log('Trend cannot be calculated with less than 2 values, returning 0');
            return 0;
        }

        const xMean = (n - 1) / 2;
        const yMean = values.reduce((a, b) => a + b) / n;

        let numerator = 0;
        let denominator = 0;

        for (let i = 0; i < n; i++) {
            numerator += (i - xMean) * (values[i] - yMean);
            denominator += Math.pow(i - xMean, 2);
        }

        const trend = denominator === 0 ? 0 : numerator / denominator;
        console.log(`Calculated trend: ${trend}`);
        return trend;
    }

    getUpcomingHolidays() {
        console.log('Fetching upcoming holidays');

        try {
            const hd = new Holidays('IL');
            const now = new Date();
            const endDate = new Date();
            endDate.setDate(now.getDate() + 14);

            // Convert Date objects to strings in the expected format
            const nowString = now.toISOString().slice(0, 10);
            const endDateString = endDate.toISOString().slice(0, 10);

            const holidays = hd.getHolidays(nowString, endDateString);
            console.log('Upcoming holidays:', holidays);

            return holidays.filter(holiday =>
                holiday.type === 'public' ||
                holiday.type === 'jewish'
            );
        } catch (error) {
            console.error('Error initializing holidays library:', error);
            console.log('Failed to fetch upcoming holidays, returning empty array');
            return []; // Return empty array to prevent calculations from breaking
        }
    }

    calculateHolidayImpact(holidays) {
        console.log('Calculating holiday impact');

        if (!holidays?.length) {
            console.log('No holidays found, returning default impact');
            return {
                isHoliday: false,
                isClosed: false,
                dietaryRestrictions: null
            };
        }

        for (const holiday of holidays) {
            const holidayName = holiday.name.split(',')[0].trim();

            // Full closure holidays
            if (['יום כיפור', 'ראש השנה', 'סוכות', 'פסח', 'שבועות'].includes(holidayName)) {
                console.log(`Full closure holiday detected: ${holidayName}`);
                return {
                    isHoliday: true,
                    isClosed: true,
                    holidayName: holidayName,
                    dietaryRestrictions: holidayName === 'פסח' ? 'no-chametz' : null
                };
            }

            // Partial working days
            if (['ערב פסח', 'ערב יום כיפור', 'ערב ראש השנה'].includes(holidayName)) {
                console.log(`Partial closure holiday detected: ${holidayName}`);
                return {
                    isHoliday: true,
                    isClosed: 'partial',
                    holidayName: holidayName,
                    dietaryRestrictions: holidayName === 'ערב פסח' ? 'no-chametz' : null
                };
            }
        }

        console.log('No holidays found, returning default impact');
        return {
            isHoliday: false,
            isClosed: false,
            dietaryRestrictions: null
        };
    }


    calculateSeasonalImpact(category, month) {
        console.log(`Calculating seasonal impact for category ${category} in month ${month}`);

        const seasons = {
            // Drinks & Beverages
            beverages: month >= 5 && month <= 8 ? 1.4 : 1.0,

            // Hot Foods
            soups: month >= 11 || month <= 2 ? 1.5 : 0.8,

            // Cold Foods
            salads: month >= 5 && month <= 8 ? 1.3 : 0.9,

            // Desserts & Sweets
            desserts: month >= 11 || month <= 1 ? 1.3 : 1.0,
            icecream: month >= 5 && month <= 8 ? 1.6 : 0.8,

            // Fresh Produce
            vegetables: month >= 3 && month <= 8 ? 1.3 : 1.0,
            fruits: month >= 5 && month <= 8 ? 1.4 : 1.0,
            herbs: month >= 3 && month <= 8 ? 1.3 : 1.0,

            // Proteins
            fish: month >= 4 && month <= 9 ? 1.2 : 1.0,  // Higher in summer
            seafood: month >= 4 && month <= 9 ? 1.3 : 0.9,
            meat: month >= 11 || month <= 2 ? 1.2 : 1.0,  // Higher in winter

            // Staples & Pantry
            rice: 1.0,  // Stable year-round
            flour: month >= 9 && month <= 12 ? 1.2 : 1.0,  // Higher during Holiday season
            spices: month >= 9 && month <= 12 ? 1.3 : 1.0,  // Higher during Holiday season

            // Holiday & Special Items
            specialty: this.isHolidaySeason(month) ? 1.5 : 0.8,
            luxury: this.isHolidaySeason(month) ? 1.6 : 0.9,  // Items like caviar, truffles

            // Default for uncategorized items
            default: 1.0
        };

        const seasonalFactor = seasons[category?.toLowerCase()] || seasons.default;
        console.log(`Seasonal factor for category ${category}: ${seasonalFactor}`);
        return seasonalFactor;
    }

    isHolidaySeason(month) {
        console.log(`Checking if month ${month} is in holiday season`);

        const holidays = {
            passover: [2, 3],     // March-April
            highHolidays: [8, 9], // September-October
            hanukkah: [11]        // December
        };
        const isHolidaySeason = Object.values(holidays).flat().includes(month);

        console.log(`Month ${month} is in holiday season: ${isHolidaySeason}`);
        return isHolidaySeason;
    }

    async fetchSalesByDateRange(userId, startDate, endDate) {
        console.log(`Fetching sales by date range for user ${userId} from ${startDate} to ${endDate}`);
        try {
            // Convert to consistent ISO format for DB comparison
            const startDateISO = new Date(startDate).toISOString();
            const endDateISO = new Date(endDate).toISOString();

            console.log('Using ISO date range:', { startDateISO, endDateISO });

            const salesQuery = await db
                .collection('users').doc(userId)
                .collection('reports').doc('sales')
                .collection('salesReports')
                .where('date', '>=', startDateISO)
                .where('date', '<=', endDateISO)
                .get();

            const sales = salesQuery.docs.map(doc => doc.data());
            // console.log('sales:', sales);

            const summary = this.calculateSalesSummary(sales);

            return {
                success: true,
                data: sales,
                summary: this.calculateSalesSummary(sales)
            };
        } catch (error) {
            console.log('Error details:', error);
            throw new Error(`Error fetching sales: ${error.message}`);
        }
    }

    async calculateTopSellingDishes(userId, startDate, endDate) {
        console.log(`Calculating top selling dishes for user ${userId} from ${startDate} to ${endDate}`);

        try {
            const salesData = await this.getHistoricalData(userId);
            const filteredSales = this.filterByTimeframe(salesData, startDate, endDate);
            const dishSales = {};

            filteredSales.forEach(sale => {
                sale.items.forEach(item => {
                    const menuItem = item.menuItem || item.name;
                    if (!dishSales[menuItem]) {
                        dishSales[menuItem] = {
                            quantity: 0,
                            totalSales: 0
                        };
                    }
                    dishSales[menuItem].quantity += (item.quantity || 1);
                    dishSales[menuItem].totalSales += (item.totalPrice || 0);
                });
            });

            const topDishes = Object.entries(dishSales)
                .sort(([, a], [, b]) => b.quantity - a.quantity)
                .slice(0, 10)
                .map(([dish, data]) => ({
                    dish,
                    quantity: data.quantity,
                    totalSales: data.totalSales
                }));


            return {
                success: true,
                data: topDishes,
                timeframe: { startDate, endDate }
            };
        } catch (error) {
            console.error('Error calculating top dishes:', error.message);
            throw new Error(`Error calculating top dishes: ${error.message}`);
        }
    }


    filterByTimeframe(salesData, startDate, endDate) {
        console.log(`Filtering sales data for date range ${startDate} to ${endDate}`);

        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        console.log('Using date range:', { startDateTime, endDateTime });

        return salesData.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= startDateTime && saleDate <= endDateTime;
        });
    }


    async calculateLeastSellingDishes(userId, startDate, endDate) {
        console.log(`Calculating least selling dishes for user ${userId} from ${startDate} to ${endDate}`);

        try {
            const salesData = await this.getHistoricalData(userId);
            const dishSales = {};
            const filteredItems = this.filterByTimeframe(salesData, startDate, endDate);

            filteredItems.forEach(sale => {
                sale.items.forEach(item => {
                    if (!dishSales[item.menuItem]) {
                        dishSales[item.menuItem] = {
                            quantity: 0,
                            totalSales: 0
                        };
                    }
                    dishSales[item.menuItem].quantity += (item.quantity || 1);
                    dishSales[item.menuItem].totalSales += (item.totalPrice || 0);
                });
            });

            const leastSold = Object.entries(dishSales)
                .sort(([, a], [, b]) => a.quantity - b.quantity)
                .slice(0, 10)
                .map(([dish, data]) => ({
                    dish,
                    quantity: data.quantity,
                    totalSales: data.totalSales
                }));

            return {
                success: true,
                data: leastSold,
                timeframe: { startDate, endDate }
            };
        } catch (error) {
            console.error(`Error calculating least selling dishes: ${error.message}`);
            throw new Error(`Error calculating least selling dishes: ${error.message}`);
        }
    }


    async fetchTopWastedIngredients(userId) {
        console.log(`Fetching top wasted ingredients for user ${userId}`);

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

            console.log('Top wasted ingredients:', topWasted);

            return {
                success: true,
                data: topWasted
            };
        } catch (error) {
            console.error(`Error fetching top wasted ingredients: ${error.message}`);
            throw new Error(`Error fetching top wasted ingredients: ${error.message}`);
        }
    }

    async fetchNonProfitableItems(userId) {
        console.log(`Fetching non-profitable items for user ${userId}`);

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

            console.log('Non-profitable items:', nonProfitable);

            return {
                success: true,
                data: nonProfitable
            };
        } catch (error) {
            console.error(`Error fetching non-profitable items: ${error.message}`);
            throw new Error(`Error fetching non-profitable items: ${error.message}`);
        }
    }

    async fetchLowStockItems(userId) {
        console.log(`Fetching low stock items for user ${userId}`);

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
                        unit: data.unit,
                        stockDeficit: data.minStockLevel - data.currentStock
                    };
                })
                .filter(item => item.currentStock <= item.minStockLevel)
                .sort((a, b) => b.stockDeficit - a.stockDeficit);

            console.log(`Found ${lowStockItems.length} low stock items`);

            return {
                success: true,
                data: lowStockItems
            };
        } catch (error) {
            console.error(`Error fetching low stock items: ${error.message}`);
            throw new Error(`Error fetching low stock items: ${error.message}`);
        }
    }

    async calculateRevenueVsWaste(userId, startDate, endDate) {
        console.log(`Calculating revenue vs waste for user ${userId} from ${startDate} to ${endDate}`);

        this.validateInput(userId, 'calculateRevenueVsWaste', { startDate, endDate });

        try {
            const [salesData, wasteData] = await Promise.all([
                this.calculateSalesAnalytics(userId, startDate, endDate),
                this.analyzeWaste(userId, startDate, endDate)
            ]);

            // Calculate forecast confidence for sales and waste data
            const salesConfidence = this.calculateForecastConfidence(
                salesData.data.startDate,
                salesData.data.endDate,
                salesData.data.totalRevenue
            );
            const wasteConfidence = this.calculateForecastConfidence(
                wasteData.data.startDate,
                wasteData.data.endDate,
                wasteData.data.totalWasteCost
            );

            console.log('Sales forecast confidence:', salesConfidence);
            console.log('Waste forecast confidence:', wasteConfidence);

            // Calculate estimated stockout risk
            const estimatedStockout = this.calculateEstimatedStockout(
                salesData.data.totalRevenue,
                wasteData.data.totalWasteCost
            );

            console.log('Estimated stockout:', estimatedStockout);

            const analysis = {
                totalRevenue: salesData.data.totalRevenue,
                totalWaste: wasteData.data.totalWasteCost,
                wastePercentage: (wasteData.data.totalWasteCost / salesData.data.totalRevenue) * 100,
                periodSummary: {
                    sales: salesData.data,
                    waste: wasteData.data
                },
                forecastConfidence: {
                    sales: salesConfidence,
                    waste: wasteConfidence
                },
                estimatedStockout: estimatedStockout
            };

            console.log('Revenue vs waste analysis:', analysis);

            return {
                success: true,
                data: analysis
            };
        } catch (error) {
            console.error(`Error calculating revenue vs waste: ${error.message}`);
            throw new Error(`Error calculating revenue vs waste: ${error.message}`);
        }
    }

    async forecastDemand(userId, startDate = new Date(), daysToForecast = 30) {
        console.log(`Forecasting demand for user ${userId} from ${startDate} for ${daysToForecast} days`);

        try {
            const historicalStartDate = new Date(startDate);
            historicalStartDate.setDate(historicalStartDate.getDate() - 30);

            const baseData = await fetchBaseData(userId, historicalStartDate.toISOString(), startDate.toISOString());
            const { inventory } = baseData;
            const holidays = this.getUpcomingHolidays();

            // If no sales data, generate forecast based on inventory levels
            const inventoryBasedForecasts = inventory.map(item => ({
                id: item.ingredientId || item.id,
                name: item.name,
                currentStock: item.currentStock || 0,
                minStockLevel: item.minStockLevel || 0,
                forecast: this.generateInitialForecast(item, daysToForecast, holidays)
            }));

            console.log('Inventory-based demand forecasts:', inventoryBasedForecasts);

            const inventoryStatus = this.analyzeInventoryStatus(inventory);
            console.log('Inventory status:', inventoryStatus);

            const initialRecommendations = this.generateInitialRecommendations(inventory);
            console.log('Initial recommendations:', initialRecommendations);

            const wasteInsights = {
                potentialWasteReduction: this.calculatePotentialWasteReduction(inventoryBasedForecasts),
                estimatedCostSavings: this.calculateEstimatedCostSavings(inventoryBasedForecasts)
            };
            console.log('Waste insights:', wasteInsights);

            return {
                success: true,
                data: {
                    forecastStartDate: startDate,
                    daysForecasted: daysToForecast,
                    items: inventoryBasedForecasts,
                    metadata: {
                        holidayEvents: holidays,
                        seasonalityFactors: true,
                        confidenceMetrics: true,
                        dataState: 'initial' // Indicate this is initial forecast without historical data
                    },
                    insights: {
                        inventoryStatus: this.analyzeInventoryStatus(inventory),
                        recommendations: this.generateInitialRecommendations(inventory)
                    },
                    wasteInsights: {
                        potentialWasteReduction: this.calculatePotentialWasteReduction(inventoryBasedForecasts),
                        estimatedCostSavings: this.calculateEstimatedCostSavings(inventoryBasedForecasts)
                    }
                }
            };
        } catch (error) {
            console.error(`Error forecasting demand: ${error.message}`);
            throw new Error(`Error forecasting demand: ${error.message}`);
        }
    }

    // Helper methods
    generateInitialForecast(item, daysToForecast, holidays) {
        console.log(`Generating initial forecast for item ${item.name} over ${daysToForecast} days`);

        const forecastDays = [];
        const startDate = new Date();
        const seasonalFactor = this.calculateSeasonalImpact(item.categoryName);
        const holidayFactor = this.calculateHolidayImpact(holidays);

        // Estimate initial daily demand based on min stock level
        const estimatedDailyDemand = item.minStockLevel ? (item.minStockLevel / 7) : 1; // Assume weekly restock if no data

        for (let i = 0; i < daysToForecast; i++) {
            const forecastDate = new Date(startDate);
            forecastDate.setDate(startDate.getDate() + i);

            forecastDays.push({
                date: forecastDate,
                estimatedDemand: estimatedDailyDemand * seasonalFactor * holidayFactor,
                confidence: 0.5, // Lower confidence due to no historical data
                factors: {
                    seasonal: seasonalFactor,
                    holiday: holidayFactor
                }
            });
        }
        console.log('Initial forecast:', forecastDays);
        return forecastDays;
    }

    analyzeInventoryStatus(inventory) {
        console.log('Analyzing inventory status');

        const totalItems = inventory.length;
        const lowStockItems = inventory.filter(item =>
            item.currentStock <= (item.minStockLevel || 0)).length;
        const stockCategories = this.categorizeInventoryLevels(inventory);
        const averageStockLevel = this.calculateAverageStockLevel(inventory);

        console.log(`Total items: ${totalItems}`);
        console.log(`Low stock items: ${lowStockItems}`);
        console.log('Stock categories:', stockCategories);
        console.log(`Average stock level: ${averageStockLevel}`);

        return {
            totalItems,
            lowStockItems,
            stockCategories,
            averageStockLevel
        };
    }

    generateInitialRecommendations(inventory) {
        console.log('Generating initial recommendations');

        const recommendations = [];

        inventory.forEach(item => {
            if (!item.currentStock && !item.minStockLevel) {
                recommendations.push({
                    itemId: item.ingredientId || item.id,
                    name: item.name,
                    type: 'SETUP',
                    priority: 'HIGH',
                    message: `Set up stock levels for ${item.name} to enable accurate forecasting`
                });
            } else if (item.currentStock <= (item.minStockLevel || 0)) {
                recommendations.push({
                    itemId: item.ingredientId || item.id,
                    name: item.name,
                    type: 'STOCK',
                    priority: 'HIGH',
                    message: `Low stock alert: ${item.name} is below minimum level`
                });
            }
        });

        console.log('Initial recommendations:', recommendations);
        return recommendations;
    }

    categorizeInventoryLevels(inventory) {
        console.log('Categorizing inventory levels');

        return {
            critical: inventory.filter(item => item.currentStock === 0).length,
            low: inventory.filter(item =>
                item.currentStock > 0 && item.currentStock <= (item.minStockLevel || 0)).length,
            adequate: inventory.filter(item =>
                item.currentStock > (item.minStockLevel || 0)).length
        };
    }

    calculateAverageStockLevel(inventory) {
        console.log('Calculating average stock level');

        const validItems = inventory.filter(item => typeof item.currentStock === 'number');
        if (!validItems.length) return 0;
        const totalStock = validItems.reduce((sum, item) => sum + item.currentStock, 0);
        return totalStock / validItems.length;
    }

    calculateForecastConfidence(startDate, endDate, value) {
        // Calculate the number of data points (days) in the date range
        const dataPoints = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

        // Calculate the trend of the value over the date range
        const trend = this.calculateTrend([value]);

        // Use the dataPoints and trend to calculate the forecast confidence
        let confidence = 0.7; // Base confidence
        confidence += Math.min(0.2, dataPoints / 30 * 0.2); // Add confidence based on data points
        confidence -= Math.min(0.2, Math.abs(trend) * 0.4); // Reduce confidence if trend is volatile

        return Math.max(0, Math.min(1, confidence));
    }


    calculateEstimatedStockout(revenue, waste) {
        // Assume a daily revenue and waste rate for simplicity
        const dailyRevenue = revenue / 30;
        const dailyWaste = waste / 30;

        // Calculate the net daily cash flow
        const dailyCashFlow = dailyRevenue - dailyWaste;

        // If the daily cash flow is negative, calculate the estimated stockout date
        if (dailyCashFlow <= 0) {
            const daysUntilStockout = Math.ceil(revenue / -dailyCashFlow);
            const stockoutDate = new Date();
            stockoutDate.setDate(stockoutDate.getDate() + daysUntilStockout);
            return {
                daysUntilStockout,
                estimatedDate: stockoutDate
            };
        } else {
            return null; // No stockout expected
        }
    }

    calculatePotentialWasteReduction(itemDemand) {
        console.log('Calculating potential waste reduction');

        // Analyze historical waste vs forecast to estimate potential reduction
        const wastagePatterns = Object.values(itemDemand).map(item => {
            const historicalWaste = item.dailySales
                .filter(sale => sale.quantity > item.inventory?.minStockLevel * 1.2)
                .length;
            return {
                itemId: item.id,
                name: item.name,
                potentialReduction: historicalWaste / item.dailySales.length * 100
            };
        });

        console.log('Potential waste reduction insights:', wastagePatterns);
        return wastagePatterns;
    }

    calculateEstimatedCostSavings(itemDemand) {
        console.log('Calculating estimated cost savings');

        // Calculate potential savings based on optimized inventory levels
        let totalSavings = 0;
        const savingsBreakdown = Object.values(itemDemand).map(item => {
            const averageExcess = item.dailySales
                .filter(sale => sale.quantity > item.inventory?.minStockLevel)
                .reduce((sum, sale) => sum + (sale.quantity - item.inventory?.minStockLevel), 0);

            const estimatedSavings = averageExcess * (item.inventory?.costPerUnit || 0);
            totalSavings += estimatedSavings;

            return {
                itemId: item.id,
                name: item.name,
                monthlySavings: estimatedSavings
            }
        });

        console.log('Estimated total monthly savings:', totalSavings);
        console.log('Savings breakdown:', savingsBreakdown);

        return {
            totalMonthlySavings: totalSavings,
            breakdown: savingsBreakdown
        }
    }

    calculateDemandVolatility(dailySales) {
        console.log('Calculating demand volatility');

        if (dailySales.length < 2) {
            console.log('Insufficient data to calculate volatility, returning 0');
            return 0;
        }

        const quantities = dailySales.map(sale => sale.quantity);
        const mean = quantities.reduce((sum, q) => sum + q, 0) / quantities.length;
        const variance = quantities.reduce((sum, q) => sum + Math.pow(q - mean, 2), 0) / quantities.length;
        const standardDeviation = Math.sqrt(variance);

        // Normalize volatility to 0-1 range
        const volatility = Math.min(1, standardDeviation / mean);
        console.log(`Calculated demand volatility: ${volatility}`);

        return volatility;
    }


    async calculateItemCost(item, costData) {
        console.log(`Calculating item cost for ${item.name}`);

        try {
            const totalCost = item.ingredients.reduce((total, ingredient) => {
                const cost = costData[ingredient.id]?.pricePerUnit || 0;
                return total + (cost * ingredient.quantity);
            }, 0);

            console.log(`Calculated item cost: $${totalCost}`);
            return totalCost;
        } catch (error) {
            console.error(`Error calculating item cost: ${error.message}`);
            throw new Error(`Error calculating item cost: ${error.message}`);
        }
    }

    async getIngredientCosts(userId) {
        console.log(`Fetching ingredient costs for user ${userId}`);

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

            console.log('Ingredient costs fetched:', costs);
            return costs;
        } catch (error) {
            console.error(`Error getting ingredient costs: ${error.message}`);
            throw new Error(`Error getting ingredient costs: ${error.message}`);
        }
    }

    async getWasteHistory(userId) {
        console.log(`Fetching waste history for user ${userId}`);

        try {
            const wasteSnapshot = await db
                .collection('users').doc(userId)
                .collection('reports').doc('waste')
                .collection('wasteReports')
                .orderBy('date', 'desc')
                .limit(90) // Last 3 months
                .get();

            const wasteHistory = wasteSnapshot.docs.map(doc => doc.data());
            console.log(`Fetched ${wasteHistory.length} waste reports`);
            return wasteHistory;
        } catch (error) {
            console.error(`Error getting waste history: ${error.message}`);
            throw new Error(`Error getting waste history: ${error.message}`);
        }
    }

    calculateWasteTrends(wasteData) {
        console.log('Calculating waste trends');

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

        // console.log('Calculated waste trends:', trends);
        return trends;
    }

    calculateSalesSummary(sales) {
        console.log('Calculating sales summary...');
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
        console.log('Sales summary:', summary);
        return summary;
    }

    async getBatchAnalytics(userId, startDate, endDate) {
        console.log(`Fetching batch analytics for user ${userId} from ${startDate} to ${endDate}`);

        try {
            const baseData = await fetchBaseData(userId, startDate, endDate);
            console.log('Fetched base data:', baseData);

            const analytics = await generateAllAnalytics(baseData);
            console.log('Generated batch analytics:', analytics);

            return {
                success: true,
                data: analytics,
                timestamp: new Date().toISOString()
            }
        } catch (error) {
            console.error(`Error fetching batch analytics: ${error.message}`);
            throw new Error(`Error fetching batch analytics: ${error.message}`);
        }
    }
}

export default new AnalyticsService();