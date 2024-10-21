import React from 'react';
import Card from '../../../Common/Card/Card';


const DailySalesReport = () => {
    return (
        <div className="flex flex-col gap-5 w-full p-6 rounded-lg sm:rounded-lg">
            <Card>
                <h1 className={`text-titles text-4xl text-center`}>Daily sales form</h1>
            </Card>
        </div>
    );
};

export default DailySalesReport;
