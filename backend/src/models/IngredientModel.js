import * as Yup from "yup";
import {allUnits} from "./Units.js";

// Schema for shelf life data
export const shelfLifeSchema = Yup.object({
    duration: Yup.number()
        .required('Duration is required')
        .positive('Duration must be positive'),
    unit: Yup.string()
        .required('Unit is required')
        .oneOf(['days', 'weeks', 'months'])
});

// Schema for supply information
export const supplySchema = Yup.object({
    packageType: Yup.string()
        .required('Package type is required'),
    unitsPerPackage: Yup.number()
        .required('Units per package is required')
        .positive('Units per package must be positive'),
    minimumOrderQuantity: Yup.number()
        .required('Minimum order quantity is required')
        .positive('Minimum order quantity must be positive'),
    supplierUnit: Yup.string()
        .required('Supplier unit is required')
        .oneOf(allUnits),
    deliveryDays: Yup.array()
        .of(Yup.string())
        .required('Delivery days are required'),
    preparationMethod: Yup.string()
        .required('Preparation method is required'),
    shelfLife: shelfLifeSchema.required('Shelf life is required')
});

// Schema for basic ingredient data
export const basicIngredientDataSchema = Yup.object({
    id: Yup.number()
        .required('Ingredient ID is required')
        .positive('Ingredient ID must be positive'),
    name: Yup.string()
        .required('Name is required'),
    category: Yup.string()
        .required('Category is required'),
    storageType: Yup.string()
        .required('Storage type is required'),
    unit: Yup.string()
        .required('Unit is required')
        .oneOf(allUnits)
});

// Schema for inventory data
export const inventoryDataSchema = Yup.object({
    stock: Yup.number()
        .required('Stock is required')
        .min(0, 'Stock cannot be negative'),
    pricePerUnit: Yup.number()
        .required('Price per unit is required')
        .positive('Price must be positive'),
    minStockLevel: Yup.number()
        .required('Minimum stock level is required')
        .min(0, 'Minimum stock level cannot be negative')
});

// Main ingredient schema combining all sub-schemas
const ingredientSchema = Yup.object({
    userId: Yup.string()
        .required('User ID is required'),
    ingredientData: Yup.object({
        ...basicIngredientDataSchema.fields,
        ...inventoryDataSchema.fields,
        allergens: Yup.array().of(Yup.string()),
        supply: supplySchema.required('Supply information is required')
    }).required('Ingredient data is required')
});

export default ingredientSchema;