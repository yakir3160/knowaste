import {menuSchema} from "./MenuModel.js";
import {ingredientSchema} from "./IngredientModel.js";

const getSchema = type => {
    switch (type) {
        case 'menu':
            return menuSchema;
        case 'ingredient':
            return ingredientSchema;
        default:
            return null;
    }
}

export const validateSchema = async (type, data) => {
    try {
        const schemaToValidate = getSchema(type);
        if (!schemaToValidate) {
            return {error: 'Invalid schema type'};
        }
        await schemaToValidate.validate(data);
        return true;
    } catch (error) {
        console.error('Validation error:', error);
        return false;
    }
}