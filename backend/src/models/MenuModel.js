import * as Yup from 'yup';
const menuItemSchema = Yup.object({
        categoryId: Yup.string().required('Category ID is required'),
        categoryName: Yup.string().required('Category is required'),
        subCategoryId: Yup.string().nullable(),
        subCategoryName: Yup.string().nullable(),
        id: Yup.string().required('Item ID is required'),
        name: Yup.string().required('Item name is required'),
        price: Yup.number()
            .required('Price is required')
            .positive('Price must be positive')
            .test('is-decimal', 'Price can have up to 2 decimal places',
                value => (value + "").match(/^\d+\.?\d{0,2}$/)),
        ingredients: Yup.array()
            .of(
                Yup.object({
                    ingredientId: Yup.string()
                        .required('Ingredient ID is required'),
                    name: Yup.string().required('Name is required'),
                    quantity: Yup.number()
                        .required('Quantity is required')
                        .positive('Quantity must be positive'),
                    unitType: Yup.string().oneOf(['g', 'kg', 'ml', 'l', 'unit'])
                })
            )
            .min(1, 'At least one ingredient is required'),
});
export default menuItemSchema;

