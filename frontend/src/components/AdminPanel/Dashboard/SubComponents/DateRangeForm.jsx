import React, { useState, useEffect } from 'react';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAnalytics } from '../../../../context/AnalyticsContext';
import Button from "../../../Common/Button/Button";
import GlobalField from "../../../Common/inputs/GlobalField";
import { getDateRange } from '../../../../utils/dateUtils';

const DateRangeForm = () => {
    const { dateRange, setDateRange, getAnalyticsData } = useAnalytics();

    const initialValues = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        timeframe: dateRange.timeframe
    };

    const validationSchema = Yup.object({
        startDate: Yup.date().required("Start date is required"),
        endDate: Yup.date().required("End date is required"),
        timeframe: Yup.string().required("Timeframe is required")
    });

    return (
        <div className="flex flex-col justify-center items-center">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const startDate = new Date(values.startDate);
                    const endDate = new Date(values.endDate);
                    getAnalyticsData(startDate, endDate);
                    setDateRange(values);
                }}
            >
                {({ values, setFieldValue }) => (
                    <Form className="gap-4 p-4 w-fit">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <GlobalField
                                type="select"
                                name="timeframe"
                                label="Time Period"
                                value={values.timeframe}
                                options={[
                                    { value: 'week', label: 'This Week' },
                                    { value: 'month', label: 'This Month' },
                                    { value: 'year', label: 'This Year' },
                                    { value: 'custom', label: 'Custom Range' }
                                ]}
                                onChange={(e) => {
                                    const newTimeframe = e.target.value;
                                    setFieldValue("timeframe", newTimeframe);

                                    if (newTimeframe !== 'custom') {
                                        const dateRange = getDateRange(newTimeframe);
                                        if (dateRange) {
                                            setFieldValue("startDate", dateRange.startDate.toISOString().split('T')[0]);
                                            setFieldValue("endDate", dateRange.endDate.toISOString().split('T')[0]);
                                        }
                                    }
                                }}
                            />
                            <GlobalField
                                type="date"
                                name="startDate"
                                label="Start Date"
                                value={values.startDate}
                                max={values.endDate}
                                disabled={values.timeframe !== 'custom'}
                                onChange={(e) => {
                                    setFieldValue("startDate", e.target.value);
                                }}
                            />
                            <GlobalField
                                type="date"
                                name="endDate"
                                label="End Date"
                                className="w-full"
                                value={values.endDate}
                                max={new Date().toISOString().split('T')[0]}
                                disabled={values.timeframe !== 'custom'}
                                onChange={(e) => {
                                    setFieldValue("endDate", e.target.value);
                                }}
                            />
                            <Button
                                type="submit"
                                className="w-full h-fit self-end border-2 border-lime"
                            >
                                Update Data
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default DateRangeForm;
