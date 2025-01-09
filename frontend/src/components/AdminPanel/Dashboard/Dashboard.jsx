import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../../contexts/AnalyticsContext';
import AdminPanelContainer from "../AdminPanelContainer";
import Button from "../../Common/Button/Button";
import Top10 from "./Top10";
import GlobalField from "../../Common/inputs/GlobalField";
import { Formik, Form } from "formik";
import * as Yup from "yup";

const Dashboard = () => {
    const {
        analyticsData,
        getAnalyticsData,
        loading: analyticsLoading,
        error: analyticsError
    } = useAnalytics();
// Get today's date at current time
    const today = new Date();

// Get start of current week (Sunday)
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - today.getDay());
    thisWeek.setHours(0, 0, 0, 0);

    const initialValues = {
        startDate: thisWeek.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0],
        timeframe: 'week'
    };
    const validationSchema = Yup.object({
        startDate: Yup.date().required("Start date is required"),
        endDate: Yup.date().required("End date is required"),
        timeframe: Yup.string().required("Timeframe is required")
    });
    const getDateRange = (timeframe) => {
        let startDate = new Date();
        const endDate = new Date();

        switch (timeframe) {
            case 'week':
                // Get the first day of current week (Sunday)
                startDate = new Date(endDate);
                startDate.setDate(endDate.getDate() - endDate.getDay());
                startDate.setHours(0, 0, 0, 0);
                console.log(startDate);
                break;

            case 'month':
                // First day of current month
                startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
                startDate.setHours(0, 0, 0, 0);
                console.log(startDate);
                break;

            case 'year':
                // First day of current year
                startDate = new Date(endDate.getFullYear(), 0, 1);
                startDate.setHours(0, 0, 0, 0);
                console.log(startDate);
                break;

            default:
                return null;
        }

        return {
            startDate: startDate,
            endDate: endDate
        };
    };


    useEffect(() => {
        getAnalyticsData(thisWeek,today);
    }, []);

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
        <AdminPanelContainer
            pageTitle="Dashboard"
            layout=""
            className=""
        >

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                    const startDate = new Date(values.startDate);
                    const endDate = new Date(values.endDate);
                        console.log(startDate);
                        console.log(endDate);
                    getAnalyticsData(startDate, endDate);
                    }}
                >
                    {({values, setFieldValue}) => (
                        <Form className="grid grid-cols-1 gap-4 p-4 w-fit">
                            <div className="grid grid-cols-4 gap-4">
                                <GlobalField
                                    type="select"
                                    name="timeframe"
                                    label="Time Period"
                                    value={values.timeframe}
                                    options={[
                                        {value: 'week', label: 'This Week'},
                                        {value: 'month', label: 'This Month'},
                                        {value: 'year', label: 'This Year'},
                                        {value: 'custom', label: 'Custom Range'}
                                    ]}
                                    onChange={(e) => {
                                        const newTimeframe = e.target.value;
                                        setFieldValue("timeframe", newTimeframe);

                                        if (newTimeframe !== 'custom') {
                                            const dateRange = getDateRange(newTimeframe);
                                            if (dateRange) {
                                                setFieldValue("startDate", dateRange.startDate);
                                                setFieldValue("endDate", dateRange.endDate);
                                            }
                                        }
                                    }}
                                />

                                {values.timeframe === 'custom' && (
                                    <>
                                        <GlobalField
                                            type="date"
                                            name="startDate"
                                            label="Start Date"
                                            value={values.startDate}
                                            onChange={(e) => {
                                                const date = new Date(e.target.value);
                                                date.setHours(0, 0, 0, 0);
                                                setFieldValue("startDate", e.target.value);
                                            }}
                                        />
                                        <GlobalField
                                            type="date"
                                            name="endDate"
                                            label="End Date"
                                            value={values.endDate}
                                            onChange={(e) => {
                                                const date = new Date(e.target.value);
                                                date.setHours(0, 0, 0, 0);
                                                setFieldValue("endDate", e.target.value);
                                            }}
                                        />
                                    </>
                                )}
                                <Button type="submit" className="w-full h-fit self-end border-2 border-lime">
                                    Update Data
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            <div className="">
                {analyticsError && (
                    <span className="text-errorRed">Error fetching data</span>
                )}
            </div>
        </AdminPanelContainer>
    );
};

export default Dashboard;