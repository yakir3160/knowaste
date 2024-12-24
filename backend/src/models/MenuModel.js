import * as Yup from 'yup';

const ingredientSchema = Yup.object({
    ingredientId: Yup.number()
        .required('Ingredient ID is required')
        .positive('Ingredient ID must be positive'),
    quantity: Yup.number()
        .required('Quantity is required')
        .positive('Quantity must be positive'),
    wasteFactor: Yup.number()
        .required('Waste factor is required')
        .min(0, 'Waste factor cannot be negative')
        .max(1, 'Waste factor cannot exceed 1')
});

const menuItemSchema = Yup.object({
    name: Yup.string()
        .required('Item name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters'),
    price: Yup.number()
        .required('Price is required')
        .positive('Price must be positive')
        .max(1000000, 'Price seems unreasonably high'),
    ingredients: Yup.array()
        .of(ingredientSchema)
        .min(1, 'At least one ingredient is required')
        .max(50, 'Cannot exceed 50 ingredients')
});

export { ingredientSchema };
export default menuItemSchema;