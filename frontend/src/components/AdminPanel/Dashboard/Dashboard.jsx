import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../../contexts/AnalyticsContext';
import {
    LineChart, Line, BarChart, Bar, AreaChart, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell, Area
} from 'recharts';
import { TrendingUp, TrendingDown } from "lucide-react";

import Card from '../../Common/Card/Card';
import AdminPanelContainer from "../AdminPanelContainer";
import { useItemsContext } from "../../../contexts/ItemsContext";
import Button from "../../Common/Button/Button";

const WASTE_COLORS = ['#de4b2c', '#217cb0', '#d09515', '#4CAF50'];

const Dashboard = () => {
    const {
        getSalesByDateRange,
        getTopSellingDishes,
        getLowStockItems,
        getWasteAnalysis,
        loading: analyticsLoading,
        error: analyticsError
    } = useAnalytics();

    const { menuItems } = useItemsContext();
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [analyticsData, setAnalyticsData] = useState({
        salesData: [],
        popularDishesData: [],
        lowStockItems: [],
        wasteData: [],
        summaryData: {
            monthlySales: 0,
            monthlyWaste: 0,
            totalRevenue: 0,
            salesTrend: 0,
            wasteTrend: 0,
            revenueTrend: 0
        }
    });


    if (analyticsLoading) {
        return (
            <AdminPanelContainer pageTitle="Dashboard" layout="grid grid-cols-1 p-2">
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl">Loading data...</div>
                </div>
            </AdminPanelContainer>
        );
    }

    return (
        <AdminPanelContainer
            pageTitle="Dashboard"
            layout="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
            className="bg-gray-100"
        >
            <Button
                className="col-span-full bg-buttons-color hover:bg-green-700"
            >
                Refresh Data
            </Button>

            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-2">
                <Card className="p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold mb-4 text-titles-color">Sales This Month</h3>
                        <div className="flex flex-col items-end px-4">
                            {analyticsData.summaryData.salesTrend > 0 ? (
                                <TrendingUp size={28} className="text-green"/>
                            ) : (
                                <TrendingDown size={28} className="text-errorRed"/>
                            )}
                            <span className={`text-md ${analyticsData.summaryData.salesTrend > 0 ? 'text-green' : 'text-errorRed'}`}>
                                {15}%
                            </span>
                        </div>
                    </div>
                    <span className="text-3xl font-semibold text-bs-green">
                        {analyticsData.summaryData.monthlySales.toLocaleString()} ₪
                    </span>
                </Card>
            </div>

            <Card className="h-[400px] p-4 col-span-2 bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-titles-color">Monthly Performance Overview</h3>
                <div className="w-full h-[calc(100%-4rem)]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart

                            margin={{top: 5, right: 30, left: 20, bottom: 5}}
                        >

                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="h-[400px] p-4 bg-white shadow-sm">
                {
                    analyticsData.popularDishesData.length > 0 ? (
                        <>
                            <h3 className="text-lg font-semibold mb-4 text-titles-color">Top Selling Dishes</h3>
                            <div className="w-full h-[calc(100%-4rem)]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={analyticsData.popularDishesData}
                                        margin={{top: 5, right: 30, left: 20, bottom: 5}}
                                    >
                                        {/* Chart components remain the same */}
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    ) : (
                        <div className="text-lg text-center text-gray-500">No sales data available</div>
                    )
                }
            </Card>

            <Card className="h-[400px] p-4 bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-titles-color">Waste Distribution</h3>
                <div className="w-full h-[calc(100%-4rem)]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                dataKey="value"
                                data={analyticsData.wasteData }
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {analyticsData.wasteData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={WASTE_COLORS[index % WASTE_COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                layout="horizontal"
                                wrapperStyle={{paddingTop: "20px"}}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="p-4 bg-white shadow-sm row-span-4">
                {analyticsData.lowStockItems.length > 0 ? (
                    analyticsData.lowStockItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center border-b border-gray-200 py-2">
                            <span className="text-lg font-semibold">{item.name}</span>
                            <span className="text-sm text-errorRed">{item.currentStock} left</span>
                        </div>
                    ))) : (
                    <div className="text-lg text-center text-gray-500">No items are low in stock</div>
                )

                }
            </Card>
        </AdminPanelContainer>
    );
};

export default Dashboard;