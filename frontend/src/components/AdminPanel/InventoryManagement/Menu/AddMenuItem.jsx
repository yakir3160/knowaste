import React, {useState} from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../Common/Button/Button';
import { Save, CircleX, Plus } from 'lucide-react';
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from "../../../Common/Card/Card";
import menuItemSchema from '../../../../schemas/firestoreSchemas/menuItemSchema';
import { v4 as generateUniqueID } from 'uuid';
import IngredientForm from './IngredientForm';
import { useItemsContext } from "../../../../contexts/ItemsContext";
import {menuCategories} from "../../../../constants/Constants";

const AddMenuItem = ({ onAdd, categories }) => {
    const [newCategory, setNewCategory] = useState(false);
    const [showIngredientForm, setShowIngredientForm] = useState(false);
    const { inventoryItems } = useItemsContext();

    const initialValues = {
        categoryName: '',
        subCategoryName: '',
        name: '',
        price: null,
        ingredients: [],
    };

    const handleSubmit = (values, { resetForm }) => {
        const newItem = {
            ...values,
            id: generateUniqueID(),
            categoryId: newCategory
                ? generateUniqueID()
                : categories.find(category => category.name === values.categoryName)?.id,
        }
        onAdd(newItem);
        resetForm();
    };

    const handleAddIngredient = (values, setFieldValue) => {
        const currentIngredients = values.ingredients || [];
        setFieldValue('ingredients', [
            ...currentIngredients,
            {
                ingredientId: '',
                quantity: 0,
                unit: ''
            }
        ]);
    };

    const handleIngredientSubmit = (ingredientValues, { resetForm }) => {
        setShowIngredientForm(false);
        resetForm();
    };

    return (
        <Card className="w-full md:w-3/4 rounded-lg p-3 mb-4 border-2 border-secondary">
            <button
                type="button"
                onClick={() => onAdd()}
                className="flex justify-center items-center shadow-outer-custom text-sm font-medium rounded-md col-span-full"
            >
                <CircleX size={22} />
            </button>

            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validationSchema={menuItemSchema}
            >
                {({ values, setFieldValue }) => (
                    <Form className="pt-3">
                        <div className="space-y-4">
                            <Button
                                type="button"
                                onClick={() => setNewCategory(!newCategory)}
                            >
                                {newCategory ? 'Existing Category' : 'New Category'}
                            </Button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {newCategory ? (
                                    <GlobalField
                                        label="Category Name"
                                        type="select"
                                        name="categoryName"
                                        className="text-titles font-medium"
                                        options={[
                                            { value: '', label: 'Select Category' },
                                            ...menuCategories.map(category => ({
                                                value: category.name,
                                                label: category.name
                                            }))
                                        ]}
                                    />
                                ) : (
                                    <GlobalField
                                        label="Category Name"
                                        type="select"
                                        name="categoryName"
                                        className="text-titles font-medium"
                                        options={[
                                            { value: '', label: 'Select Category' },
                                            ...categories.map(category => ({
                                                value: category.name,
                                                label: category.name
                                            }))
                                        ]}
                                    />
                                )}

                                <GlobalField
                                    label="Sub Category Name (optional)"
                                    type="text"
                                    name="subCategoryName"
                                    className="text-titles font-medium"
                                />

                                <GlobalField
                                    label="Name"
                                    type="text"
                                    name="name"
                                    className="text-titles text-xl font-semibold"
                                    autoFocus={true}
                                />
                                <GlobalField
                                    label="Price (₪)"
                                    type="number"
                                    name="price"
                                    className="text-lg font-medium text-primary"
                                    placeholder={0}

                                />
                            </div>

                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Ingredients</h3>
                                    <Button
                                        type="button"
                                        onClick={() => setShowIngredientForm(true)}
                                        className="text-sm"
                                    >
                                        New Ingredient <Plus size={16} className="ml-2" />
                                    </Button>
                                </div>

                                {values.ingredients?.map((ingredient, index) => (
                                    <div key={index} className="grid grid-cols-3 gap-4 mb-4">
                                        <GlobalField
                                            label="Ingredient"
                                            type="select"
                                            name={`ingredients.${index}.ingredientId`}
                                            options={[
                                                { value: '', label: 'Select Ingredient' },
                                                ...inventoryItems.map(item => ({
                                                    value: item.id,
                                                    label: item.name
                                                }))
                                            ]}
                                        />
                                        <GlobalField
                                            label="Quantity"
                                            type="number"
                                            name={`ingredients.${index}.quantity`}
                                        />
                                        <GlobalField
                                            label="Unit"
                                            type="select"
                                            name={`ingredients.${index}.unit`}
                                            options={[
                                                { value: '', label: 'Select Unit' },
                                                { value: 'g', label: 'Grams' },
                                                { value: 'kg', label: 'Kilograms' },
                                                { value: 'ml', label: 'Milliliters' },
                                                { value: 'unit', label: 'Units' }
                                            ]}
                                        />
                                    </div>
                                ))}


                                <Button
                                    type="button"
                                    onClick={() => handleAddIngredient(values, setFieldValue)}
                                    className="w-full mt-2"
                                >
                                    Add Ingredient
                                </Button>
                            </div>

                            <div className="flex mt-4">
                                <Button
                                    type="submit"
                                    className="flex justify-center items-center w-full px-4 py-2 text-sm font-medium border border-lime rounded-md col-span-full"
                                >
                                    Save
                                    <Save size={20} className="ml-2" />
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
            {showIngredientForm && (
                <div className=" pt-3 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
                        <IngredientForm
                            isFromMenuItem={true}
                            onSubmit={handleIngredientSubmit}
                            onCancel={() => setShowIngredientForm(false)}
                        />
                    </div>
                </div>
            )}


        </Card>
    );
};

export default AddMenuItem;
