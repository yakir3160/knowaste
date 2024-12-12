import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import GlobalField from "../../../../Common/inputs/GlobalField";
import { useItemsContext } from "../../../../../contexts/ItemsContext";
import Button from "../../../../Common/Button/Button";

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    category: Yup.string().when('isNewProduct', {
        is: true,
        then: Yup.string().required('Category is required')
    }),
    storageType: Yup.string().when('isNewProduct', {
        is: true,
        then: Yup.string().required('Storage type is required')
    }),
    pricePerUnit: Yup.number().when('isNewProduct', {
        is: true,
        then: Yup.number().min(0, 'Must be positive').required('Price is required')
    }),
    minStockLevel: Yup.number().when('isNewProduct', {
        is: true,
        then: Yup.number().min(0, 'Must be positive').required('Minimum stock is required')
    }),
    amountPerDish: Yup.number().min(0, 'Must be positive').required('Amount is required'),
    unit: Yup.string().required('Unit is required'),
    allergens: Yup.array()
});

const IngredientForm = ({ initialValues, onSubmit, isEditing = true, fieldPrefix = "", index }) => {
    const { ingredients, ingredientCategories, ingredientStorageTypes, measurementUnits } = useItemsContext();
    const [isNewProduct, setIsNewProduct] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const defaultInitialValues = {
        name: '',
        category: '',
        storageType: '',
        pricePerUnit: '',
        minStockLevel: '',
        amountPerDish: '',
        unit: '',
        allergens: [],
        isNewProduct: false
    };

    const getFieldName = (field) => `${fieldPrefix}${index}.${field}`;

    const handleProductSelection = (productName, setFieldValue) => {
        const product = ingredients.find(ing => ing.name === productName);
        if (product) {
            setSelectedProduct(product);
            Object.entries(product).forEach(([key, value]) => {
                setFieldValue(getFieldName(key), value);
            });
        }
    };

    return (
        <Formik
            initialValues={initialValues || defaultInitialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => onSubmit(values)}
        >
            {({ setFieldValue, values }) => (
                <Form className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
                    <Button
                        type="button"
                        onClick={() => {
                            setIsNewProduct(!isNewProduct);
                            setSelectedProduct(null);
                            Object.keys(defaultInitialValues).forEach(key => {
                                setFieldValue(getFieldName(key), defaultInitialValues[key]);
                            });
                        }}
                        className={`w-full ${isNewProduct ? 'bg-lime' : 'bg-white'} border border-lime`}
                        disabled={!isEditing}
                    >
                        {isNewProduct ? 'Set as Existing Product' : 'Set as New Product'}
                    </Button>

                    <GlobalField
                        label="Name"
                        type={isNewProduct ? "text" : "select"}
                        name={getFieldName('name')}
                        className="text-buttons text-sm w-full"
                        disabled={!isEditing}
                        options={isNewProduct ? [] : [
                            {value: '', label: 'Select or type new ingredient'},
                            ...ingredients.map(ing => ({
                                value: ing.name,
                                label: ing.name
                            }))
                        ]}
                        onChange={(e) => {
                            setFieldValue(getFieldName('name'), e.target.value);
                            if (!isNewProduct) {
                                handleProductSelection(e.target.value, setFieldValue);
                            }
                        }}
                    />

                    {isNewProduct && (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <GlobalField
                                    label="Category"
                                    type="select"
                                    name={getFieldName('category')}
                                    className="text-buttons text-sm"
                                    disabled={!isEditing}
                                    options={ingredientCategories}
                                />
                                <GlobalField
                                    label="Storage Type"
                                    type="select"
                                    name={getFieldName('storageType')}
                                    className="text-buttons text-sm"
                                    disabled={!isEditing}
                                    options={ingredientStorageTypes}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <GlobalField
                                    label="Price per Unit"
                                    type="number"
                                    name={getFieldName('pricePerUnit')}
                                    className="text-buttons text-sm"
                                    disabled={!isEditing}
                                    min="0"
                                    step="0.01"
                                />
                                <GlobalField
                                    label="Minimum Stock Level"
                                    type="number"
                                    name={getFieldName('minStockLevel')}
                                    className="text-buttons text-sm"
                                    disabled={!isEditing}
                                    min="0"
                                />
                            </div>

                            <div className="space-y-2 border-2 border-lime rounded-sm p-4">
                                <label className="block text-sm font-medium text-gray">Allergens</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        {value: 'nuts', label: 'Nuts'},
                                        {value: 'dairy', label: 'Dairy'},
                                        {value: 'eggs', label: 'Eggs'},
                                        {value: 'soy', label: 'Soy'},
                                        {value: 'wheat', label: 'Wheat'},
                                        {value: 'fish', label: 'Fish'},
                                        {value: 'shellfish', label: 'Shellfish'}
                                    ].map((allergen) => (
                                        <label key={allergen.value} className="flex items-center space-x-2">
                                            <Field
                                                type="checkbox"
                                                name={getFieldName('allergens')}
                                                value={allergen.value}
                                                disabled={!isEditing}
                                                className="form-checkbox h-4 w-4 bg-lime rounded border-lime focus:ring-lime"
                                            />
                                            <span className="text-sm">{allergen.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <GlobalField
                            label="Amount"
                            type="number"
                            name={getFieldName('amountPerDish')}
                            className="text-buttons text-sm"
                            disabled={!isEditing}
                            min="0"
                        />
                        <GlobalField
                            label="Unit"
                            type="select"
                            name={getFieldName('unit')}
                            className="text-buttons text-sm"
                            disabled={!isEditing || (!isNewProduct && !selectedProduct)}
                            options={measurementUnits}
                        />
                    </div>

                    {selectedProduct && !isNewProduct && (
                        <div className="mt-4 p-4 rounded-lg">
                            <h3 className="text-sm font-semibold mb-2">Product Details</h3>
                            <p className="text-sm">Category: {selectedProduct.category}</p>
                            <p className="text-sm">Storage Type: {selectedProduct.storageType}</p>
                            <p className="text-sm">Price per Unit: {selectedProduct.pricePerUnit}</p>
                            <p className="text-sm">Minimum Stock Level: {selectedProduct.minStockLevel}</p>
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-lime"
                        disabled={!isEditing}
                    >
                        {isNewProduct ? 'Add New Ingredient' : 'Save Changes'}
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default IngredientForm;
