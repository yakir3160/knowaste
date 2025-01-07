import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../Common/Button/Button';
import { Save, CircleX, Plus } from 'lucide-react';
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from "../../../Common/Card/Card";
import menuItemSchema from '../../../../schemas/firestoreSchemas/menuItemSchema';
import {v4 as generateUniqueID, validate} from 'uuid';
import IngredientForm from './IngredientForm';
import { useItemsContext } from "../../../../contexts/ItemsContext";
import { measurementUnits, menuCategories } from "../../../../constants/Constants";
import useFilteredItems from "../../../../Hooks/Items/useFilteredItems";

const AddMenuItem = ({ onAdd, categories, initialValues = null, isFromMenuItem = null }) => {
    const [newCategory, setNewCategory] = useState(false);
    const [showIngredientForm, setShowIngredientForm] = useState(false);
    const [itemIngredients, setItemIngredients] = useState([]);
    const { inventoryItems, inventoryCategories, addMenuItem } = useItemsContext();
    const {setSelectedCategory,filteredItems} = useFilteredItems(inventoryItems, inventoryCategories);

    console.log(inventoryCategories);
    const defaultValues = {
        categoryName: '',
        subCategoryName: '',
        name: '',
        price: '',
        ingredients: [],
    };
    console.log(initialValues);

    const handleSubmit = async (values, { resetForm }) => {
        const fullItem = {
            ...values,
            ingredients: itemIngredients,
        }
        const itemToSubmit = isFromMenuItem
            ? {
                fullItem,
                id: initialValues.id,
            }
            : {
                ...fullItem,
                menuItemId: generateUniqueID(),
                categoryId: newCategory
                    ? menuCategories.find(category => category.name === values.categoryName)?.id
                    : categories.find(category => category.name === values.categoryName)?.id,
            };

        console.log('Form submitted:', itemToSubmit);
        await addMenuItem(itemToSubmit);
        resetForm();
    };

    const handleAddIngredient = (values, setFieldValue) => {
        // Validation checks
        if (!values.ingredientName || !values.ingredientQuantity || !values.unitForMenu) {
            alert('Please fill all ingredient fields');
            return;
        }

        // Validate quantity is positive
        if (values.ingredientQuantity <= 0) {
            alert('Quantity must be greater than 0');
            return;
        }

        // If all validations pass, add the ingredient
        setItemIngredients([
            ...itemIngredients,
            {
                ingredientId: values.ingredientId,
                name: values.ingredientName,
                quantity: values.ingredientQuantity,
                unitForMenu: values.unitForMenu,
            },
        ]);

        // Reset fields
        setFieldValue('category', '');
        setFieldValue('ingredientName', '');
        setFieldValue('ingredientQuantity', '');
        setFieldValue('unitForMenu', '');
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
                initialValues={initialValues || defaultValues}
                onSubmit={handleSubmit}
                validationSchema={menuItemSchema}
            >
                {({ values, setFieldValue }) => (
                    <Form className="pt-3">
                        <div className="space-y-4">
                            <Button type="button" onClick={() => setNewCategory(!newCategory)}>
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
                                                label: category.name,
                                            })),
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
                                                label: category.name,
                                            })),
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
                                    value={values.name}
                                />
                                <GlobalField
                                    label="Price (₪)"
                                    type="number"
                                    name="price"
                                    className="text-lg font-medium text-primary"
                                    placeholder={0}
                                />
                            </div>

                            <div className="mt-6 bg-white p-3 rounded-sm space-y-4">
                                <div className="flex justify-between items-center py-3 ">
                                    <h3 className="text-xl text-center text-titles font-semibold">Ingredients</h3>

                                    <Button
                                        type="button"
                                        onClick={() => setShowIngredientForm(true)}
                                        className="text-sm flex flex-row border-2 border-lime"
                                    >
                                        Add New Ingredient <Plus size={16} className="ml-2" />
                                    </Button>
                                </div>

                                <div className={`p-2 border-2 border-secondary rounded-sm`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ">
                                        <GlobalField
                                            label="category"
                                            type="select"
                                            name={`category`}
                                            options={[
                                                { value: '', label: 'Select Category' },
                                                ...inventoryCategories.map(category => ({
                                                    value: category,
                                                    label: category,
                                                })),
                                            ]}
                                            onChange={e => setSelectedCategory(e.target.value)}
                                        />
                                        <GlobalField
                                            label="Ingredient"
                                            type="select"
                                            name={'ingredientName'}
                                            options={[
                                                { value: '', label: 'Select Ingredient' },
                                                ...filteredItems.map(item => ({
                                                    value: item.name,
                                                    label: item.name,
                                                })),
                                            ]}
                                            onChange={e => {
                                                setFieldValue(`ingredientName`, e.target.value);
                                                const selectedItem = inventoryItems.find(item => item.name === e.target.value);
                                                setFieldValue(`ingredientId`, selectedItem?.ingredientId);
                                            }}
                                        />
                                        <GlobalField label="Quantity" type="number" name={`ingredientQuantity`} />
                                        <GlobalField
                                            label="Unit"
                                            type="select"
                                            name={`unitForMenu`}
                                            options={[
                                                { value: '', label: 'Select unit' },
                                                ...measurementUnits.map(unit => ({
                                                    value: unit,
                                                    label: unit,
                                                })),
                                            ]}
                                        />
                                        <input type="hidden" name={`ingredientId`} />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => handleAddIngredient({
                                            ingredientId: values.ingredientId,
                                            ingredientName: values.ingredientName,
                                            ingredientQuantity: values.ingredientQuantity,
                                            unitForMenu: values.unitForMenu,
                                        }, setFieldValue)}
                                        className="w-full mt-2"
                                    >
                                        Add Ingredient
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center mt-4">
                                <h3 className="text-xl text-center text-titles font-semibold">Ingredients</h3>
                                {itemIngredients.length > 0 ? (
                                        <div className="p-4 rounded-sm">
                                            <div className="grid grid-cols-1 space-y-2 ">

                                                {itemIngredients.map((ingredient, index) => (
                                                    <>
                                                        <div key={index} className="text-lg grid grid-cols-3 border-2 border-secondary p-3 rounded-sm ">
                                                            <p>{ingredient.name}</p>
                                                            <p>{ingredient.quantity} {ingredient.unitForMenu}</p>
                                                            <CircleX
                                                                size={20}
                                                                className="text-errorRed cursor-pointer self-center"
                                                                onClick={() => setItemIngredients(itemIngredients.filter((_, i) => i !== index))}
                                                            />
                                                        </div>

                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                    :
                                    (
                                        <div className="p-2 self-center  rounded-sm">
                                            <p>No ingredients added</p>
                                        </div>
                                    )}
                            </div>
                            <div className="flex mt-4">
                                <Button
                                    type="submit"
                                    className="flex justify-center items-center w-full px-4 py-2 text-sm font-medium border border-lime rounded-md col-span-full"
                                >
                                    Save
                                    <Save size={20} className="ml-2"/>
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>

            {showIngredientForm && (
                <div className=" p-4 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
                        <IngredientForm
                            isFromMenuItem={true}
                            onSubmit={ingredientValues => handleIngredientSubmit(ingredientValues)}
                            onCancel={() => setShowIngredientForm(false)}
                        />
                    </div>
                </div>
            )}
        </Card>
    );
};

export default AddMenuItem;
