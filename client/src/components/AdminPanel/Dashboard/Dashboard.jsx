import React, {} from 'react';
import { useAnalytics } from '../../../context/AnalyticsContext';
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
        error: analyticsError,
    } = useAnalytics();


    const salesSummary = analyticsData?.salesSummary || {};
    const wasteData = analyticsData?.wasteData || {};
    const salesData = analyticsData?.salesData || [];
    const popularDishesData = analyticsData?.popularDishesData || [];
    const leastSellingDishesData = analyticsData?.leastSellingDishesData || [];
    const lowStockItems = analyticsData?.lowStockItems || [];
    const wasteByReason = wasteData?.wasteByReason || [];
    const topWastedIngredients = wasteData?.topWastedIngredients || [];
    const timeFrame = dateRange?.timeframe !== 'custom' ? dateRange?.timeframe.charAt(0).toUpperCase() + dateRange?.timeframe.slice(1) : 'Range';




    return (
        <AdminPanelContainer pageTitle="Dashboard" layout="" className="">
            {analyticsLoading ? (
                <Loading />
            ) : (
                <>
                    {/* טופס בחירת טווח תאריכים */}
                    <DateRangeForm/>

                    {/* סיכום נתונים */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-2xl font-semibold text-titles self-center">
                            Summary for This {timeFrame}
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 px-2">
                            <Summary
                                data={salesSummary.totalSales || 0}
                                numOfItems={salesSummary.totalItems || 0}
                                avgOrder={salesSummary.avgOrderValue || 0}
                                title="Sales"
                            />
                            <Summary
                                data={wasteData.totalWasteCost || 0}
                                title="Waste Cost"
                            />
                            <Summary
                                data={(salesSummary.totalSales || 0) - (wasteData.totalWasteCost || 0)}
                                title="Net Value"
                            />
                        </div>
                    </div>

                    {/* הודעת שגיאה */}
                    {analyticsError && (
                        <div className="text-errorRed text-center p-2">
                            Error fetching data
                        </div>
                    )}

                    {/* תרשימים ונתונים */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2  p-2 ">
                        <div className="col-span-1 lg:col-span-2">
                            <SalesAreaChart salesData={salesData} wasteData={wasteData.wasteReports}/>
                        </div>
                        <Top10 data={popularDishesData} title="Top Selling Dishes" timeframe={timeFrame}/>
                        <Top10 data={topWastedIngredients} title="Top Wasted Ingredients" timeframe={timeFrame}/>
                        <div className="col-span-1 lg:col-span-2">
                            <WastePieChart wasteByReason={wasteByReason}/>
                        </div>
                        <Top10 data={leastSellingDishesData} title="Least Selling Dishes" timeframe={timeFrame}/>
                        <div className="col-span-1 lg:col-span-2">
                            <LowStockItems data={lowStockItems}/>
                        </div>
                    </div>


                </>
            )}
        </AdminPanelContainer>
    );
};

export default Dashboard;
