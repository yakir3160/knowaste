import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import Card from "../../../Common/Card/Card";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8661C1'];

const renderCustomizedLabel = ({ name, value, percent }) => {
    return `${name}: ${value} ₪ (${(percent * 100).toFixed(0)}%)`;
};

const WastePieChart = ({ wasteByReason }) => {
    const data = [
        { name: 'Damaged', value: wasteByReason?.damaged || 0 },
        { name: 'Quality', value: wasteByReason?.quality || 0},
        { name: 'Expired', value: wasteByReason?.expired || 0},
        { name: 'Storage', value: wasteByReason?.storage || 0},
        { name: 'Over Production' , value: wasteByReason?.overproduction || 0},
    ];

    return (
        <Card className="w-full">
            <h1 className="text-lg font-semibold mb-4 text-titles-color">Waste By Reason</h1>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default WastePieChart;