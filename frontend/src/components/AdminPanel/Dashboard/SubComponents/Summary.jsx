import React from 'react';
import Card from '../../../Common/Card/Card';
import { TrendingUp } from 'lucide-react';

const Summary = ({ data, title, numOfItems, trend }) => {
    return (
        <Card className="p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold mb-4 text-titles-color">{title}</h3>
                <div className="flex flex-col items-end px-4">
                    <TrendingUp size={28} className="text-green"/>
                    <span className="text-md text-green">{trend}</span>
                </div>
            </div>
            <span className="text-3xl font-semibold text-bs-green">{data}</span>
        </Card>
    );
};

export default Summary;
