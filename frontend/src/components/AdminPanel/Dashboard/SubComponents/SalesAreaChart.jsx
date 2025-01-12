import React from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from 'recharts';
import Card from "../../../Common/Card/Card";

const SalesAreaChart = ({ salesData }) => {
    const sortedData = salesData
        .map(item => ({
            ...item,
            totalSales: item.totalSales || 0, // הוספת ברירת מחדל לנתונים חסרים
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <Card className="p-4 bg-white shadow-sm">
            <h1 className="text-lg font-semibold mb-4 text-titles-color">Sales</h1>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sortedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="totalSales" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default SalesAreaChart;
