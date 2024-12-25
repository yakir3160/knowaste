import * as Yup from "yup";

const ingredientSchema = Yup.object({
    id: Yup.string()
        .required('ID is required'),
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    category: Yup.string()
        .required('Category is required'),
    unit: Yup.string()
        .required('Unit is required'),
    stock: Yup.number()
        .required('Stock is required')
        .min(0, 'Stock cannot be negative'),
    minStockLevel: Yup.number()
        .required('Minimum stock level is required')
        .min(0, 'Minimum stock level cannot be negative'),
    pricePerUnit: Yup.number()
        .required('Price per unit is required')
        .min(0, 'Price cannot be negative'),
    storageType: Yup.string()
        .required('Storage type is required'),
    allergens: Yup.array()
        .of(Yup.string())
        .default([])
        .required('Allergens field is required'),
    // Optional analytics fields
    usageStats: Yup.object({
        averageDailyUsage: Yup.number().min(0),
        wastePercentage: Yup.number().min(0).max(100)
    }).optional(),
    wasteHistory: Yup.array().optional()
});

export { ingredientSchema };
