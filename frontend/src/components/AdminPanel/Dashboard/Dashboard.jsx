import React from 'react';
import { useAnalytics } from '../../../contexts/AnalyticsContext';
import AdminPanelContainer from "../AdminPanelContainer";
import DateRangeForm from "./SubComponents/DateRangeForm";
import Top10 from "./SubComponents/Top10";
import LowStockItems from "./SubComponents/LowStockItems";
import SalesAreaChart from './SubComponents/SalesAreaChart';
import Summary from './SubComponents/Summary';
import Loading from '../../Common/Loading/Loading';
import WastePieChart from "./SubComponents/WastePieChart";


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
                    <DateRangeForm/>
                    <div className="flex  flex-col justify-center ">
                        <h1 className="text-2xl font-semibold text-titles self-center">Summary for
                            This {dateRange.timeframe} </h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2">
                            <Summary data={analyticsData.salesSummary.totalSales} numOfItems={analyticsData.salesSummary.totalItems} avgOrder={analyticsData.salesSummary.avgOrderValue
                            } title="Sales"/>
                            <Summary data={analyticsData.wasteData.totalWasteCost}  title="Waste Cost"/>
                            <Summary data={analyticsData.salesSummary.totalSales - analyticsData.wasteData.totalWasteCost} title="Net Value"/>
                        </div>
                    </div>
                    <div className="">
                        {analyticsError && (
                            <span className="text-errorRed">Error fetching data</span>
                        )}
                    </div>

                    <div className={`grid grid-cols-1 md:grid-cols-3 gap-2 p-2`}>
                        <div className="col-span-2">
                            <SalesAreaChart salesData={analyticsData.salesData}/>
                        </div>
                        <Top10 data={analyticsData.popularDishesData} title="Top Selling Dishes"/>
                        <Top10 data={analyticsData.leastSellingDishesData} title="Least Selling Dishes"/>
                        <div className="col-span-2">
                            <WastePieChart wasteByReason={analyticsData.wasteData.wasteByReason}/>
                        </div>
                            <Top10 data={analyticsData.wasteData.topWastedIngredients} title=" Top Wasted Ingredients"/>
                            <LowStockItems data={analyticsData.lowStockItems}/>

                        </div>


                    </>
                    )}

                </AdminPanelContainer>
    );
};

export default Dashboard;