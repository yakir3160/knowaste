import React, { useState, useEffect } from 'react';
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

const Dashboard = () => {
    const { getMenuItems } = useItemsContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [lowStockItems, setLowStockItems] = useState([
        { name: 'Milk', currentStock: 5, maxStock: 20 },
        { name: 'Eggs', currentStock: 3, maxStock: 15 }
    ]);

    // Sales data
    const salesData = [
        { name: 'January', Revenue: 4000, WasteCosts: 2000,Delta : 2000 },
        { name: 'February', Revenue: 3000,WasteCosts: 1500,Delta : 1500 },
        { name: 'March', Revenue: 5000, WasteCosts: 3100 ,Delta : 1900},
        { name: 'April', Revenue: 4500, WasteCosts: 6598 ,Delta : 2002},
        { name: 'May', Revenue: 6000, WasteCosts: 3150 ,Delta : 2850},
    ];

    // Updated popular dishes data with trend information
    const popularDishesData = [
        { name: 'Pizza', value: 150, prevValue: 130, trend: 'up' },
        { name: 'Pasta', value: 120, prevValue: 140, trend: 'down' },
        { name: 'Salad', value: 100, prevValue: 80, trend: 'up' },
        { name: 'Burger', value: 80, prevValue: 85, trend: 'down' },
        { name: 'Sushi', value: 75, prevValue: 65, trend: 'up' },
        { name: 'Steak', value: 70, prevValue: 90, trend: 'down' },
        { name: 'Fish & Chips', value: 65, prevValue: 50, trend: 'up' },
        { name: 'Risotto', value: 60, prevValue: 70, trend: 'down' },
        { name: 'Soup', value: 55, prevValue: 45, trend: 'up' },
        { name: 'Dessert', value: 50, prevValue: 60, trend: 'down' }
    ].sort((a, b) => b.value - a.value);

    const wasteData = [
        { name: 'Vegetables', value: 40 },
        { name: 'Meat', value: 30 },
        { name: 'Fish', value: 20 },
        { name: 'Bread', value: 10 }
    ];

    const WASTE_COLORS = ['#de4b2c', '#217cb0', '#d09515', '#4CAF50'];

    const PopularDishesList = () => (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-titles-color">Top 10 Menu Items</h3>
                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-1 border border-lime rounded-md text-sm focus:outline-none "
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>

            </div>
            <Button
                to={"/admin-panel/sales-report"}
                className="border border-lime w-fit"
            >
                Add New Sales
            </Button>
            <div className="flex-1 overflow-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left">Dish</th>
                        <th className="px-4 py-2 text-right">Orders</th>
                        <th className="px-4 py-2 text-center">Trend</th>
                    </tr>
                    </thead>
                    <tbody>
                    {popularDishesData.map((dish, index) => (
                        <tr key={index} className="border-b">
                            <td className="px-4 py-3">{dish.name}</td>
                            <td className="px-4 py-3 text-right">{dish.value}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-center">
                                    {dish.trend === 'up' ? (
                                        <div className="flex items-center text-green">
                                            <TrendingUp size={16} />
                                            <span className="ml-1 text-sm">
                                            {Math.round((dish.value - dish.prevValue) / dish.prevValue * 100)}%
                                        </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-errorRed">
                                            <TrendingDown size={16} />
                                            <span className="ml-1 text-sm">
                                            {Math.round((dish.prevValue - dish.value) / dish.prevValue * 100)}%
                                        </span>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const LowStockList = () => (
        <div className="p-4 ">
            <div className={`flex justify-between items-center`}>
                <h4 className="text-lg font-semibold mb-4 text-titles-color">Low Stock Items</h4>
                <Button
                    to={"/admin-panel/inventory-management"}
                    className="border border-lime"
                >
                    Restock
                </Button>
            </div>

            <ul className="space-y-3 py-3">
                {lowStockItems.map((item, index) => (
                    <li key={index} className="flex justify-between items-center p-2 bg-errorLightRed rounded">
                        <span>{item.name}</span>
                        <span className="text-errorRed">{item.currentStock}/{item.maxStock}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    // useEffect(() => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 2000);
    // }, []);

    if (loading) {
        return (
            <AdminPanelContainer pageTitle="Dashboard" layout="grid grid-cols-1 p-2">
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl">Loading data...</div>
                </div>
            </AdminPanelContainer>
        );
    }

    if (error) {
        return (
            <AdminPanelContainer pageTitle="Dashboard" layout="grid grid-cols-1 p-2">
                <div className="flex justify-center items-center h-64 text-errorRed">
                    <div className="text-xl">Error loading data: {error}</div>
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
            <Button onClick={getMenuItems} className="col-span-full bg-buttons-color hover:bg-green-700">
                Refresh Data
            </Button>
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-2">
                <Card className="p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold mb-4 text-titles-color">Sales This Month</h3>
                        <div className="flex flex-col items-end px-4">
                            <TrendingUp size={28} className="text-green"/>
                            <span className="text-md text-green">+5%</span>
                        </div>
                    </div>
                    <span className="text-3xl font-semibold text-bs-green">20,000 ₪</span>
                </Card>
                <Card className="p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold mb-4 text-titles-color">Waste Cost This Month</h3>
                        <div className="flex flex-col items-end px-4">
                            <TrendingDown size={28} className="text-green"/>
                            <span className="text-md text-green
                            ">-10%</span>
                        </div>
                    </div>
                    <span className="text-3xl font-semibold text-bs-green">2,000 ₪</span>
                </Card>
                <Card className="p-4 bg-white shadow-sm">
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold mb-4 text-titles-color">Total Revenue</h3>
                        <div className="flex flex-col items-end px-4">
                            <TrendingDown size={28} className="text-errorRed"/>
                            <span className="text-md text-errorRed">-15%</span>
                        </div>
                    </div>
                    <span className="text-3xl font-semibold text-bs-green">100,000 ₪</span>
                </Card>
            </div>


            <Card className="h-[400px] p-4 col-span-2 bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-titles-color">Monthly Performance Overview</h3>
                <div className="w-full h-[calc(100%-4rem)]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={salesData}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                            />
                            <Legend
                                verticalAlign="top"
                                height={36}
                            />
                            <Area
                                type="monotone"
                                dataKey="Revenue"
                                name="Total Sales"
                                stroke="#16A34A"
                                fill="#6ff6a1"
                            />
                            <Area
                                type="monotone"
                                dataKey="WasteCosts"
                                name="Food Waste"
                                stroke="rgb(255, 99, 132)"
                                fill="rgb(255, 99, 120)"
                            />
                            <Area
                                type="monotone"
                                dataKey="Delta"
                                name="Net Profit"
                                stroke="#d09515"
                                fill="rgb(255,255, 150)"
                                />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card className="h-[400px] p-4 bg-white shadow-sm">
                <PopularDishesList />
            </Card>

            <Card className="h-[400px] p-4 bg-white shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-titles-color">Waste Distribution</h3>
                <div className="w-full h-[calc(100%-4rem)]"> {/* Adjusted height */}
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart >
                            <Pie
                                dataKey="value"
                                data={wasteData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {wasteData.map((entry, index) => (
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
                                wrapperStyle={{
                                    paddingTop: "20px"
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Card>

                <Card className="p-4 bg-white shadow-sm row-span-4">
                <LowStockList />
            </Card>
        </AdminPanelContainer>
    );
};

export default Dashboard;