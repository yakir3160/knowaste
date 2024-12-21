import menuItemSchema from "./MenuModel.js";
import {ingredientSchema} from "./IngredientModel.js";

const getSchema = type => {
    switch (type) {
        case 'menu':
            return menuItemSchema;
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
        console.log('Schema validation successful');
        return {success: true};
    } catch (error) {
        console.error('Schema validation error:', error);
        return {error: error.message};
    }
}