import * as Yup from "yup";
import { baseReportSchema, REPORT_TYPES } from './ReportModel.js';

const salesItemSchema = Yup.object({
    id: Yup.string()
        .required('Item ID is required'),
    category: Yup.string()
        .required('Category is required'),
    subCategory: Yup.string(),
    menuItem: Yup.string()
        .required('Menu item name is required'),
    quantity: Yup.number()
        .min(0, 'Quantity must be positive')
        .required('Quantity is required'),
    totalPrice: Yup.number()
        .min(0, 'Price must be positive')
        .required('Price is required')
});

const salesReportSchema = baseReportSchema.shape({
    items: Yup.array()
        .of(salesItemSchema)
        .min(1, 'At least one item is required'),
    summary: Yup.object({
        totalItems: Yup.number().min(0),
        totalSales: Yup.number().min(0),
        totalSalesPreTax: Yup.number().min(0),
        tax: Yup.number().min(0)
    })
});

export {
    salesItemSchema,
    salesReportSchema
};