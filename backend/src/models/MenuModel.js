import * as Yup from "yup";
import {allUnits} from "./Units.js";

export const  menuIngredientSchema = Yup.object({
    ingredientId: Yup.number().required().positive(),
    quantity: Yup.number().required().positive()
});

export const  menuItemSchema = Yup.object({
    id: Yup.number().required().positive(),
    name: Yup.string().required(),
    price: Yup.number().required().positive(),
    availability: Yup.string().required().oneOf(['available', 'unavailable']),
    ingredients: Yup.array().of(menuIngredientSchema).required()
});

export const  subCategorySchema = Yup.object({
    id: Yup.string().required(),
    name: Yup.string().required(),
    items: Yup.array().of(menuItemSchema).required()
});

export const  categorySchema = Yup.object({
    id: Yup.string().required(),
    name: Yup.string().required(),
    items: Yup.array().of(menuItemSchema).required(),
    subCategories: Yup.array().of(subCategorySchema)
});

export const menuSchema = Yup.object({
    categories: Yup.array().of(categorySchema).required(),
    lastUpdated: Yup.date().required(),
    version: Yup.number().required().positive()
});