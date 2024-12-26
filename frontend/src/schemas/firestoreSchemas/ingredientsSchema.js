import * as Yup from "yup";

const ingredientSchema = Yup.object({
    // Base fields for all cases
    ingredientId: Yup.string().required('ID is required'),
    name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
    categoryName: Yup.string().required('Category is required'),
    unit: Yup.string().required('Unit is required'),
    quantityPerUnit: Yup.number().required('Quantity per unit is required'),
    pricePerUnit: Yup.number().required('Price per unit is required').min(0),
    storageType: Yup.string().required('Storage type is required'),
    allergens: Yup.array().of(Yup.string()).default([]),

    // Menu item specific fields
    quantityForItemMenu: Yup.number().when('$isFromMenuItem', {
        is: true,
        then: Yup.number().required('Quantity for menu item is required').min(0)
    }),

    // Order specific fields
    orderDetails: Yup.object({
        receivedQuantity: Yup.number(),
        expirationDate: Yup.date(),
        batchNumber: Yup.string(),
        receivedDate: Yup.date()
    }).when('$isFromOrder', {
        is: true,
        then: Yup.object({
            receivedQuantity: Yup.number().required('Received quantity is required').min(0),
            expirationDate: Yup.date().required('Expiration date is required'),
            receivedDate: Yup.date().required('Received date is required')
        })
    })
}).test('contextValidation', null, function(value) {
    return true;
});

export { ingredientSchema };
