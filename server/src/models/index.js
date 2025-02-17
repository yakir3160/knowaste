import * as Yup from "yup";
import menuItemSchema from "./MenuModel.js";
import { ingredientSchema } from "./IngredientModel.js";
import { salesReportSchema } from "./SalesReportModel.js";
import { wasteReportSchema } from "./WasteReportModel.js";
import { REPORT_TYPES, REPORT_STATUSES } from "./ReportModel.js";
export { calculateSalesSummary, calculateWasteSummary } from './helpers/reportCalculations.js';

const getSchema = type => {
    switch (type) {
        case 'menu':
            return menuItemSchema;
        case 'ingredient':
            return ingredientSchema;
        case 'salesReport':
            return salesReportSchema;
        case 'wasteReport':
            return wasteReportSchema;
        default:
            return null;
    }
}

export const validateSchema = async (type, data) => {
    try {
        console.log('Validating schema:', type);
        const schemaToValidate = getSchema(type);
        if (!schemaToValidate) {
            return {
                success: false,
                error: `Invalid schema type: ${type}`
            };
        }

        await schemaToValidate.validate(data, {
            abortEarly: false,
            stripUnknown: true
        });
        console.log('Schema validation successful');
        return {
            success: true
        };


    } catch (error) {
        console.error('Schema validation error:', error);
        if (error.inner && error.inner.length > 0) {
            const errors = error.inner.map(err => ({
                field: err.path,
                message: err.message
            }));
            return {
                success: false,
                error: 'Validation failed',
                details: errors
            };
        } return {
            success: false,
            error: error.message
        };
    }
};

export {
    REPORT_TYPES,
    REPORT_STATUSES
};
