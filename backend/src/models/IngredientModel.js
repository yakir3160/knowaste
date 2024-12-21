import * as Yup from "yup";
import {allUnits} from "./Units.js";



export const shelfLifeSchema = Yup.object({
    duration: Yup.number().required().positive(),
    unit: Yup.string().required().oneOf(['days', 'weeks', 'months'])
});

export const  supplySchema = Yup.object({
    packageType: Yup.string().required(),
    unitsPerPackage: Yup.number().required().positive(),
    minimumOrderQuantity: Yup.number().required().positive(),
    supplierUnit: Yup.string().required().oneOf(allUnits),
    deliveryDays: Yup.array().of(Yup.string()).required(),
    preparationMethod: Yup.string().required(),
    shelfLife: shelfLifeSchema.required()
});

export const  ingredientSchema = Yup.object({
    id: Yup.number().required().positive(),
    name: Yup.string().required(),
    category: Yup.string().required(),
    storageType: Yup.string().required(),
    unit: Yup.string().required().oneOf(allUnits),
    stock: Yup.number().required().min(0),
    pricePerUnit: Yup.number().required().positive(),
    minStockLevel: Yup.number().required().min(0),
    allergens: Yup.array().of(Yup.string()),
    supply: supplySchema.required(),
    lastUpdated: Yup.date().required()
});