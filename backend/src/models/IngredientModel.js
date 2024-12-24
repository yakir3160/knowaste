import * as Yup from "yup";

// Schema for waste history
const wasteHistorySchema = Yup.object({
    date: Yup.string()
        .required('Date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    quantity: Yup.number()
        .required('Quantity is required')
        .min(0, 'Quantity cannot be negative'),
    reason: Yup.string()
        .required('Waste reason is required')
        .oneOf(['EXPIRED', 'DAMAGED', 'SPOILED', 'OTHER']),
    cost: Yup.number()
        .required('Cost is required')
        .min(0, 'Cost cannot be negative')
});

// Schema for usage statistics
const usageStatsSchema = Yup.object({
    averageDailyUsage: Yup.number()
        .required('Average daily usage is required')
        .min(0, 'Average daily usage cannot be negative'),
    wastePercentage: Yup.number()
        .required('Waste percentage is required')
        .min(0, 'Waste percentage cannot be negative')
        .max(100, 'Waste percentage cannot exceed 100')
});

// Updated ingredient schema focusing on waste and usage analysis
const ingredientSchema = Yup.object({

        id: Yup.string()
            .required('ID is required'),
        name: Yup.string()
            .required('Name is required'),
        usageStats: usageStatsSchema
            .required('Usage statistics are required'),
        wasteHistory: Yup.array()
            .of(wasteHistorySchema)
            .default([]).required('Ingredient data is required'),
});
export {
    ingredientSchema,
    wasteHistorySchema,
    usageStatsSchema
};
