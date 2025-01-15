import React, { useState } from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer, Legend } from 'recharts';
import Card from "../../../Common/Card/Card";
import useFormatNumberWithCommas from "../../../../Hooks/Items/useFormatNumberWithCommas";
import Button from "../../../Common/Button/Button";

const SalesAreaChart = ({ salesData, wasteData }) => {
    const [chartType, setChartType] = useState('combined'); // 'sales', 'waste', 'combined'
    const formatNumberWithCommas = useFormatNumberWithCommas();
    const combinedData = salesData.map(sale => {
        const matchingWaste = wasteData.find(waste => waste.date === sale.date);
        return {
            date: new Date(sale.date).toLocaleDateString('he-IL'),
            sales: sale.summary.totalSales,
            waste: matchingWaste ? matchingWaste.summary.totalCost : 0
        };
    });

    return (
        <Card >
            <div className="flex justify-between items-center mb-4">

                <h1 className="text-lg font-semibold text-titles-color">
                    {chartType === 'combined' && 'Combined Sales & Waste'}
                    {chartType === 'sales' && 'Sales Data'}
                    {chartType === 'waste' && 'Waste Data'}
                </h1>
                <Button className={`border-2 border-lime`} to={'/admin-panel/sales-report'}>Add Sales Report</Button>
                <select
                    className="p-2 border-2 border-secondary rounded-md focus:outline-none  focus:border-lime  "
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                >
                    <option value="combined">Combined View</option>
                    <option value="sales">Sales Only</option>
                    <option value="waste">Waste Only</option>
                </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={combinedData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis  />
                    <Tooltip
                        formatter={(value) => formatNumberWithCommas(value) + ' ₪'}
                    />
                    <Legend />
                    {(chartType === 'sales' || chartType === 'combined') && (
                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke="#16A34A"
                            fill="#64ea97"
                            name="Sales"
                        />
                    )}
                    {(chartType === 'waste' || chartType === 'combined') && (
                        <Area
                            type="monotone"
                            dataKey="waste"
                            stroke="#e30b0b"
                            fill="#fde8e8"
                            name="Waste"
                        />
                    )}
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default SalesAreaChart;
