import * as Yup from 'yup';

const menuItemSchema = Yup.object().shape({
        categoryName: Yup.string().required('Category is required'),
        subCategoryName: Yup.string(),
        name: Yup.string().required('Item name is required'),
        price: Yup.number()
            .required('Price is required')
            .positive('Price must be positive')
            .test('is-decimal', 'Price can have up to 2 decimal places',
                value => !value || (value + "").match(/^\d+\.?\d{0,2}$/))

});

export default menuItemSchema;

// ingredients: Yup.array()
//     .of(
//         Yup.object({
//           ingredientId: Yup.number()
//               .required('Ingredient ID is required')
//               .positive('Ingredient ID must be positive'),
//           quantity: Yup.number()
//               .required('Quantity is required')
//               .positive('Quantity must be positive'),
//         })
//     )
//     .min(1, 'At least one ingredient is required'),