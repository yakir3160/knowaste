import * as Yup from 'yup';

const menuItemSchema = Yup.object().shape({
        categoryName: Yup.string().required('Category is required'),
        name: Yup.string()
            .required('Name is required')
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name must be less than 50 characters'),
        price: Yup.number()
            .required('Price is required')
            .min(0, 'Price must be positive')
            .max(1000000, 'Price is too high'),
        ingredients: Yup.array().of(
            Yup.object().shape({
                    ingredientId: Yup.string().required('ID is required'),
                    name: Yup.string().required('Name is required'),
                    quantity: Yup.number().required('Quantity is required').min(0, 'Amount must be positive'),
                    unit: Yup.string().required('Unit is required'),
            })
        )
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