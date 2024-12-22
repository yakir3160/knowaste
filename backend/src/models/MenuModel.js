import * as Yup from "yup";

const menuItemSchema = Yup.object({
    userId: Yup.string().required('User ID is required'),
    menuItemData: Yup.object({
        categoryId: Yup.string().required('Category ID is required'),
        categoryName: Yup.string().required('Category name is required'),
        subcategoryId: Yup.string().nullable(),
        subcategoryName: Yup.string().nullable(),
        name: Yup.string().required('Item name is required'),
        price: Yup.number()
            .required('Price is required')
            .positive('Price must be positive')
            .typeError('Price must be a number'),
        available: Yup.boolean().required('Availability is required'),
        ingredients: Yup.array()
            .of(
                Yup.object({
                    ingredientId: Yup.number()
                        .required('Ingredient ID is required')
                        .positive('Ingredient ID must be positive')
                        .typeError('Ingredient ID must be a number'),
                    quantity: Yup.number()
                        .required('Quantity is required')
                        .positive('Quantity must be positive')
                        .typeError('Quantity must be a number')
                })
            )
            .min(1, 'At least one ingredient is required')
    }).required('Menu item data is required')
});
export default menuItemSchema;