import * as Yup from 'yup';

// Define validation schema for each waste item
const wasteItemSchema = Yup.object().shape({
    ingredientId: Yup.string()
        .required('Ingredient ID is required'),
    ingredientName: Yup.string()
        .required('Ingredient name is required'),
    quantity: Yup.number()
        .required('Quantity is required')
        .min(0, 'Quantity must be positive')
        .typeError('Quantity must be a number'),
    unit: Yup.string()
        .required('Unit is required'),
    reason: Yup.string()
        .required('Reason is required')
        .oneOf(
            ['expired', 'damaged', 'quality', 'overproduction', 'storage', 'other'],
            'Invalid reason selected'
        ),
    cost: Yup.number()
        .required('Cost is required')
        .min(0, 'Cost must be positive')
        .typeError('Cost must be a number')
});


// Define the main waste report schema
const wasteReportSchema = Yup.object().shape({
    date: Yup.date()
        .max(new Date(), 'Report date cannot be in the future')
        .required('Report date is required'),
    items: Yup.array()
        .of(wasteItemSchema)
        .min(1, 'At least one item is required'),
});

// Export the schemas
export {
    wasteItemSchema,
    wasteReportSchema
};