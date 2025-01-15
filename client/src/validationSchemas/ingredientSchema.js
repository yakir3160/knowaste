import * as Yup from 'yup';
import { REQUIRED_MSG } from '../constants/Constants';

export const ingredientSchema = Yup.object().shape({
    name: Yup.string()
        .required(REQUIRED_MSG)
        .min(2, 'Name must be at least 2 characters'),
    category: Yup.string()
        .required(REQUIRED_MSG),
    storageType: Yup.string()
        .required(REQUIRED_MSG),
    amount: Yup.number()
        .required(REQUIRED_MSG)
        .min(0, 'Amount must be positive'),
    unit: Yup.string()
        .required(REQUIRED_MSG),
    pricePerUnit: Yup.number()
        .required(REQUIRED_MSG)
        .min(0, 'Price must be positive'),
    kosherStatus: Yup.string()
        .required(REQUIRED_MSG),
    allergens: Yup.array()
        .of(Yup.string())
        .min(0),
    minStockLevel: Yup.number()
        .required(REQUIRED_MSG)
        .min(0, 'Stock level must be positive')
});
