import React from 'react';
import { Formik, Form, Field } from 'formik';
import GlobalField from "../../../Common/inputs/GlobalField";
import Button from "../../../Common/Button/Button";
import { ingredientStorageTypes, measurementUnits, allergenTypes, ingredientCategories } from "../../../../constants/Constants";
import { ingredientSchema } from "../../../../schemas/firestoreSchemas/ingredientsSchema";
import { v4 as generateUniqueID } from 'uuid';
import { CircleX } from "lucide-react";
import Card from "../../../Common/Card/Card";
import { useItemsContext } from "../../../../contexts/ItemsContext";

const IngredientForm = ({ onSubmit, onCancel, isFromMenuItem = false, isFromOrder = false, initialValues = null, isEditing = false }) => {
    const { addInventoryItem } = useItemsContext();

    const defaultValues = {
        ingredientId: generateUniqueID(),
        name: '',
        categoryName: '',
        storageType: '',
        pricePerUnit: '',
        quantityPerUnit: '',
        unit: '',
        allergens: [],
        ...(isFromMenuItem && { quantityForItemMenu: '' }),
        ...(isFromOrder && {
            receivedQuantity: '',
            expirationDate: new Date().toISOString().split('T')[0],
            receivedDate: new Date().toISOString().split('T')[0]
        }),
    };

    const actualInitialValues = initialValues || defaultValues;

    const handleSubmit = (values, { resetForm }) => {
        console.log('Form submitted:', values);
        if (isFromMenuItem) {
            const menuItemIngredient = {
                ingredientId: values.id,
                name: values.name,
                quantity: values.quantityForItemMenu,
                unit: values.unit
            };
            onSubmit(menuItemIngredient);
        } else if (isFromOrder) {
            const orderIngredient = {
                ...values,
                receivedQuantity: values.receivedQuantity,
                expirationDate: values.expirationDate,
                receivedDate: values.receivedDate
            };
            onSubmit(orderIngredient);
        }
        addInventoryItem(values);
        resetForm();
        onCancel();
    };

    return (
        <Card className="border-2 border-secondary p-6">
            <button
                type="button"
                onClick={onCancel}
                className="flex justify-center items-center shadow-outer-custom text-sm font-medium rounded-md mb-4"
            >
                <CircleX size={22} />
            </button>
            <Formik
                initialValues={actualInitialValues}
                validationSchema={ingredientSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, setFieldValue, errors, touched }) => (
                    <Form className="space-y-4">
                        <h2 className="text-xl font-semibold text-titles">
                            {isEditing ? 'Edit Ingredient' : 'Add New Ingredient'}
                        </h2>
                        {isFromOrder && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-2 border-lime p-3 rounded-sm">
                                <GlobalField label="Received Quantity" type="number" name="receivedQuantity" />
                                <GlobalField
                                    label="Expiration Date"
                                    type="date"
                                    name="expirationDate"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <GlobalField label="Received Date" type="date" name="receivedDate" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <GlobalField label="Name" type="text" name="name" className="text-buttons text-sm" />
                            <GlobalField
                                label="Category"
                                type="select"
                                name="categoryName"
                                className="text-buttons text-sm"
                                options={[
                                    { value: '', label: 'Select category' },
                                    ...ingredientCategories.map(category => ({
                                        value: category.name,
                                        label: category.name
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
                            <GlobalField label="Quantity per Unit" type="number" name="quantityPerUnit" />
                            <GlobalField
                                label="Unit"
                                type="select"
                                name="unit"
                                options={[
                                    { value: '', label: 'Select unit' },
                                    ...measurementUnits.map(unit => ({
                                        value: unit,
                                        label: unit
                                    }))
                                ]}
                            />
                            <GlobalField
                                label="Price per Unit"
                                type="number"
                                name="pricePerUnit" />
                            {isFromMenuItem && (
                                <>
                                    <GlobalField
                                        label="Quantity for Menu Item"
                                        type="number"
                                        name="quantityForItemMenu"
                                        onFocus={() => setFieldValue('quantityForItemMenu', '')}
                                    />
                                    <GlobalField
                                        label="Unit for Menu Item"
                                        type="select"
                                        name="unit"
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
                            <Button type="submit" className="bg-lime">
                                {isEditing ? 'Update Ingredient' : isFromMenuItem ? 'Add to Menu Item' : 'Add Ingredient'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default IngredientForm;
