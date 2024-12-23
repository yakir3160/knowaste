
const menuItemSchema = Yup.object({
    userId: Yup.string()
        .required('User ID is required'),
    menuItemData: Yup.object({
        name: Yup.string().required('Item name is required'),
        price: Yup.number()
            .required('Price is required')
            .positive('Price must be positive'),
        ingredients: Yup.array()
            .of(
                Yup.object({
                    ingredientId: Yup.number()
                        .required('Ingredient ID is required')
                        .positive('Ingredient ID must be positive'),
                    quantity: Yup.number()
                        .required('Quantity is required')
                        .positive('Quantity must be positive'),
                    wasteFactor: Yup.number()
                        .required('Waste factor is required')
                        .min(0, 'Waste factor cannot be negative')
                        .max(1, 'Waste factor cannot exceed 1'),
                })
            )
            .min(1, 'At least one ingredient is required'),
    }).required('Menu item data is required')
});
export default menuItemSchema;

