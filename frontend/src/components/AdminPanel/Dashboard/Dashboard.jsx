import React from 'react';
import { useAnalytics } from '../../../contexts/AnalyticsContext';
import AdminPanelContainer from "../AdminPanelContainer";
import DateRangeForm from "./SubComponents/DateRangeForm";
import Top10 from "./SubComponents/Top10";
import LowStockItems from "./SubComponents/LowStockItems";
import SalesAreaChart from './SubComponents/SalesAreaChart';
import Summary from './SubComponents/Summary';
import Loading from '../../Common/Loading/Loading';


const Dashboard = () => {
    const {
        dateRange,
        analyticsData,
        loading: analyticsLoading,
        error: analyticsError
    } = useAnalytics();

    return (
        <AdminPanelContainer pageTitle="Dashboard" layout="" className="">
            {analyticsLoading ? (
                <Loading />
            ) : (
                <>
                    <DateRangeForm />
                    <div className="">
                        {analyticsError && (
                            <span className="text-errorRed">Error fetching data</span>
                        )}
                    </div>

                    <div className="flex flex-col w-fit self-end">
                        <Top10 data={analyticsData.popularDishesData} title="Selling Dishes" />
                        <Top10 data={analyticsData.leastSellingDishesData} title="Least Selling Dishes" />
                        <Top10 data={analyticsData.wasteData.topWastedIngredients} title="Wasted Ingredients" />
                    </div>

                    <LowStockItems data={analyticsData.lowStockItems} />
                    <SalesAreaChart salesData={analyticsData.salesData} />
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-semibold text-titles-color">Summary for This {dateRange.timeframe} </h1>
                        <h2 className="text-lg font-semibold text-titles-color">From {dateRange.startDate} to {dateRange.endDate}</h2>
                        <Summary data={analyticsData.salesSummary.totalSales} numOfItems={analyticsData.salesSummary.totalItems} title="Sales" />
                        {/* <Summary data={analyticsData.wasteData} title="Waste Cost" /> */}
                        <Summary data={analyticsData.salesSummary.totalItems - analyticsData.wasteData.totalWasteCost} title="Revenew" />
                    </div>

                </>
            )}

        </AdminPanelContainer>
    );
};

export default Dashboard;