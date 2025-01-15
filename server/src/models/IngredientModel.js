import * as Yup from "yup";

const ingredientSchema = Yup.object({
    ingredientId: Yup.string()
        .required('ID is required'),
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    categoryName: Yup.string()
        .required('Category is required'),
    unit: Yup.string()
        .required('Unit is required'),
    quantityPerUnit: Yup.number()
        .required('Quantity per unit is required')
        .positive('Quantity must be positive'),
    pricePerUnit: Yup.number()
        .required('Price per unit is required')
        .min(0, 'Price cannot be negative'),
    storageType: Yup.string()
        .required('Storage type is required'),
    allergens: Yup.array()
        .of(Yup.string())
        .default([])
        .required('Allergens field is required'),
    minStockLevel: Yup.number()
        .optional(),
    currentStock: Yup.number()
        .optional(),

    // Optional order-related fields
    receivedQuantity: Yup.number().optional(),
    expirationDate: Yup.date().optional(),
    receivedDate: Yup.date().optional(),

    // Optional analytics fields
    usageStats: Yup.object({
        averageDailyUsage: Yup.number().min(0),
        wastePercentage: Yup.number().min(0).max(100)
    }).optional(),
    wasteHistory: Yup.array().optional()
});

export { ingredientSchema };
