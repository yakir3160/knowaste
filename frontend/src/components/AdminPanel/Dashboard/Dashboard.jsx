import React from 'react';
import { useAnalytics } from '../../../contexts/AnalyticsContext';
import AdminPanelContainer from "../AdminPanelContainer";
import DateRangeForm from './DateRangeForm';
import Top10 from "./Top10";

const Dashboard = () => {
    const {
        analyticsData,
        loading: analyticsLoading,
        error: analyticsError
    } = useAnalytics();

    if (analyticsLoading) {
        return (
            <AdminPanelContainer pageTitle="Dashboard" layout="grid grid-cols-1 p-2">
                <div className="flex justify-center items-center h-64">
                    <div className="text-xl">Loading data...</div>
                </div>
            </AdminPanelContainer>
        );
    }

    return (
        <AdminPanelContainer pageTitle="Dashboard" layout="" className="">
            <DateRangeForm />
            <div className="">
                {analyticsError && (
                    <span className="text-errorRed">Error fetching data</span>
                )}
            </div>
            <Top10
                data={analyticsData.popularDishesData}
                title="Selling Dishes"
            />
            <Top10
                data={analyticsData.leastSellingDishesData}
                title="Least Selling Dishes"
            />
        </AdminPanelContainer>
    );
};

export default Dashboard;
