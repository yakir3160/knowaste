import * as Yup from "yup";
import { baseReportSchema } from './ReportModel.js';
import { allUnits } from './Units.js';

const validateUnitForIngredient = (value, context) => {
    if (!allUnits.includes(value)) {
        return false;
    }
    return true;
};


const wasteItemSchema = Yup.object({
    ingredientId: Yup.string()
        .required('Ingredient ID is required'),
    ingredientName: Yup.string()
        .required('Ingredient name is required'),
    quantity: Yup.number()
        .min(0, 'Quantity must be positive')
        .required('Quantity is required'),
    unit: Yup.string()
        .required('Unit is required')
        .oneOf(allUnits, `Unit must be one of: ${allUnits.join(', ')}`),
    reason: Yup.string()
        .oneOf(['expired', 'damaged', 'quality', 'overproduction', 'storage', 'other'])
        .required('Reason is required'),
    cost: Yup.number()
        .min(0, 'Cost must be positive')
        .required('Cost is required')
});

const wasteReportSchema = baseReportSchema.shape({
    items: Yup.array()
        .of(wasteItemSchema)
        .min(1, 'At least one item is required'),
    summary: Yup.object({
        totalItems: Yup.number().min(0),
        totalCost: Yup.number().min(0)
    })
});

export {
    wasteItemSchema,
    wasteReportSchema
};
