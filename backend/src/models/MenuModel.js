import * as Yup from "yup";
import {allUnits} from "./Units.js";

const shelfLifeSchema = Yup.object({
    duration: Yup.number().required('Duration is required').positive(),
    unit: Yup.string().required('Unit is required').oneOf(['days', 'weeks', 'months'])
});

const ingredientSchema = Yup.object({
    userId: Yup.string().required('User ID is required'),
    ingredientData: Yup.object({
        name: Yup.string().required('Name is required'),
        category: Yup.string().required('Category is required'),
        storageType: Yup.string().required('Storage type is required'),
        unit: Yup.string().required('Unit is required').oneOf(allUnits),
        stock: Yup.number().required('Stock is required').min(0),
        pricePerUnit: Yup.number().required('Price is required').positive(),
        minStockLevel: Yup.number().required('Minimum stock level is required').min(0),
        allergens: Yup.array().of(Yup.string()),
        packageType: Yup.string().required('Package type is required'),
        unitsPerPackage: Yup.number().required('Units per package is required').positive(),
        minimumOrderQuantity: Yup.number().required('Minimum order quantity is required').positive(),
        supplierUnit: Yup.string().required('Supplier unit is required').oneOf(allUnits),
        deliveryDays: Yup.array().of(Yup.string()).required('Delivery days are required'),
        preparationMethod: Yup.string().required('Preparation method is required'),
        shelfLife: shelfLifeSchema.required('Shelf life is required'),
        lastUpdated: Yup.date().required('Last updated date is required')
    }).required('Ingredient data is required')
});

export default ingredientSchema;
