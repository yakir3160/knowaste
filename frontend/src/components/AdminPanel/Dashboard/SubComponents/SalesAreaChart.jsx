
import React from 'react';
import { AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';

const SalesAreaChart = ({ salesData }) => {
    return (
        <AreaChart width={500} height={300} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
    );
};

export default SalesAreaChart;