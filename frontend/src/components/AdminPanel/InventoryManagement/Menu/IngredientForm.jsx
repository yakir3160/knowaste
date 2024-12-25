import React from 'react';
import { Formik, Form, Field } from 'formik';
import GlobalField from "../../../Common/inputs/GlobalField";
import Button from "../../../Common/Button/Button";
import {ingredientStorageTypes, measurementUnits, allergenTypes,ingredientCategories} from "../../../../constants/Constants";
import {ingredientSchema} from "../../../../schemas/firestoreSchemas/ingredientsSchema";
import { v4 as generateUniqueID } from 'uuid';
import {CircleX} from "lucide-react";
import Card from "../../../Common/Card/Card";

const IngredientForm = ({ onSubmit, onCancel, isFromMenuItem = false, initialValues = null, isEditing = false }) => {
    const defaultValues = {
        id: generateUniqueID(),
        name: '',
        category: '',
        storageType: '',
        pricePerUnit: '',
        minStockLevel: '',
        stock: 0,
        unit: '',
        allergens: [],
        quantityForItemMenu: isFromMenuItem ? 0 : '',

    };

    const actualInitialValues = initialValues || defaultValues;

    const handleSubmit = (values, { resetForm }) => {
        if (isFromMenuItem) {
            const menuItemIngredient = {
                ingredientId: values.id,
                quantity: values.quantityForItemMenu,
                unit: values.unit
            };
            console.log('New ingredient for menu item:', menuItemIngredient);
            onSubmit(menuItemIngredient);
        } else {
            console.log(isEditing ? 'Updating ingredient:' : 'New ingredient created:', values);
            onSubmit(values);
        }
        resetForm();
        onCancel();
    };

    return (
        <Card className={`border-2 border-secondary`}>
            <button
                type="button"
                onClick={onCancel}
                className="flex justify-center items-center shadow-outer-custom text-sm font-medium rounded-md col-span-full"
            >
                <CircleX size={22}/>
            </button>
            <Formik
                initialValues={actualInitialValues}
                validationSchema={ingredientSchema}
                onSubmit={(values, actions) => handleSubmit(values, actions)}
            >
                {({values, setFieldValue}) => (
                    <Form lassName="space-y-4 p-6">
                        <h2 className="text-xl font-semibold mb-6 text-titles">
                            {isEditing ? 'Edit Ingredient' : 'Add New Ingredient'}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <GlobalField
                                label="Name"
                                type="text"
                                name="name"
                                className="text-buttons text-sm"
                            />

                            <GlobalField
                                label="Category"
                                type="select"
                                name="category"
                                className="text-buttons text-sm"
                                options={[
                                    { value: '', label: 'Select category' },
                                    ...ingredientCategories.map(category => ({
                                        value: category.name,
                                        label: category.name,
                                    }))
                                ]}
                            />
                            <GlobalField
                                label="Storage Type"
                                type="select"
                                name="storageType"
                                className="text-buttons text-sm"
                                options={[
                                    { value: '', label: 'Select storage type' },
                                    ...ingredientStorageTypes.map(type => ({
                                        value: type,
                                        label: type
                                    }))
                                ]}
                            />



                            <GlobalField
                                label="Price per Unit"
                                type="number"
                                name="pricePerUnit"
                                className="text-buttons text-sm"
                            />

                            <GlobalField
                                label="Minimum Stock Level"
                                type="number"
                                name="minStockLevel"
                                className="text-buttons text-sm"
                            />

                            <GlobalField
                                label="Current Stock"
                                type="number"
                                name="stock"
                                className="text-buttons text-sm"
                            />

                            {isFromMenuItem && (
                                <>
                                    <GlobalField
                                        label="Quantity for Menu Item"
                                        type="number"
                                        name="quantityForItemMenu"
                                        className="text-buttons text-sm"
                                        onFocus={() => setFieldValue('quantityForItemMenu', '')}
                                    />
                                    <GlobalField
                                        label="Unit for Menu Item"
                                        type="select"
                                        name="unit"
                                        className="text-buttons text-sm"
                                        options={[
                                            { value: '', label: 'Select unit' },
                                            ...measurementUnits.map(unit => ({
                                                value: unit,
                                                label: unit
                                            }))
                                        ]}
                                    />
                                </>
                            )}
                            <GlobalField
                                label="Unit"
                                type="select"
                                name="unit"
                                className="text-buttons text-sm"
                                options={[
                                    { value: '', label: 'Select unit' },
                                    ...measurementUnits.map(unit => ({
                                        value: unit,
                                        label: unit
                                    }))
                                ]}
                            />
                        </div>

                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">Allergens</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {allergenTypes.map(allergen => (
                                    <label key={allergen} className="flex items-center space-x-2">
                                        <Field
                                            type="checkbox"
                                            name="allergens"
                                            value={allergen}
                                            className="form-checkbox h-4 w-4 text-lime rounded border-gray-300"
                                        />
                                        <span className="text-sm">{allergen}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end mt-6">
                            <Button
                                type="submit"
                                className="bg-lime"
                            >
                                {isEditing ? 'Update Ingredient' : (isFromMenuItem ? 'Add to Menu Item' : 'Add Ingredient')}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default IngredientForm;
