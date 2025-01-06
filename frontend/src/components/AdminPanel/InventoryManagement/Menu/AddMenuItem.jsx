import React, {useEffect, useState} from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../Common/Button/Button';
import { Save, CircleX, Plus } from 'lucide-react';
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from "../../../Common/Card/Card";
import menuItemSchema from '../../../../schemas/firestoreSchemas/menuItemSchema';
import { v4 as generateUniqueID } from 'uuid';
import IngredientForm from './IngredientForm';
import { useItemsContext } from "../../../../contexts/ItemsContext";
import {measurementUnits, menuCategories} from "../../../../constants/Constants";

const AddMenuItem = ({ onAdd, categories,initialValues = null,isFromMenuItem = null}) => {
    const [newCategory, setNewCategory] = useState(false);
    const [showIngredientForm, setShowIngredientForm] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const { inventoryItems ,addMenuItem,itemsError,setItemsError,clearMessages} = useItemsContext();


    const defaultValues = {
        categoryName: '',
        subCategoryName: '',
        name: '',
        price: '',
        ingredients: [],
    };
    console.log(initialValues)

    const handleSubmit = async (values, { resetForm }) => {
        const itemToSubmit = isFromMenuItem
            ? {
                ...values,
                id:initialValues.id,
            }
            : {
                ...values,
                menuItemId: generateUniqueID(),
                categoryId: newCategory
                    ? menuCategories.find(category => category.name === values.categoryName)?.id
                    : categories.find(category => category.name === values.categoryName)?.id
            };

        console.log('Form submitted:', itemToSubmit);

        try {
            const response = await addMenuItem(itemToSubmit);
            if (response) {
                setSuccessMsg('Item added successfully!');
                setTimeout(() => {
                    onAdd(itemToSubmit);
                    resetForm();
                }, 3000);
            }
        } catch (error) {
            setItemsError(error.message);
        }
    };


    const handleAddIngredient = (values, setFieldValue) => {
        const currentIngredients = values.ingredients || [];
        setFieldValue('ingredients', [
            ...currentIngredients,
            {
                ingredientId: '',
                name: '',
                quantity: null,
                unitType: ''
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
                initialValues={initialValues || defaultValues}
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

                                {values.ingredients?.map((ingredient, index) => (
                                    <div className={`p-2 border-2 border-secondary rounded-sm`}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updatedIngredients = values.ingredients.filter((_, i) => i !== index);
                                                setFieldValue('ingredients', updatedIngredients);
                                            }}
                                            className=" text-errorRed  w-fit px-2 "
                                        >
                                            <CircleX size={20}/>
                                        </button>
                                        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ">
                                            <GlobalField
                                                label="Ingredient"
                                                type="select"
                                                name={`ingredients.${index}.name`}
                                                options={[
                                                    {value: '', label: 'Select Ingredient'},
                                                    ...inventoryItems.map(item => ({
                                                        value: item.name,
                                                        label: item.name
                                                    }))
                                                ]}
                                                onChange={(e) => {
                                                    setFieldValue(`ingredients.${index}.name`, e.target.value);
                                                    const selectedItem = inventoryItems.find(item => item.name === e.target.value);
                                                    setFieldValue(`ingredients.${index}.ingredientId`, selectedItem?.ingredientId);
                                                }}
                                            />
                                            <GlobalField
                                                label="Quantity"
                                                type="number"
                                                name={`ingredients.${index}.quantity`}
                                            />
                                            <GlobalField
                                                label="Unit"
                                                type="select"
                                                name={`ingredients.${index}.unitType`}
                                                options={[
                                                    { value: '', label: 'Select unit' },
                                                    ...measurementUnits.map(unit => ({
                                                        value: unit,
                                                        label: unit
                                                    }))
                                                ]}
                                            />
                                            <input
                                                type="hidden"
                                                name={`ingredients.${index}.ingredientId`}
                                                value={ingredient.ingredientId}

                                            />

                                        </div>
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
                <div className=" p-4 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg w-full max-w-2xl">
                        <IngredientForm
                            isFromMenuItem={true}
                            onSubmit={(ingredientValues) => handleIngredientSubmit( ingredientValues)}
                            onCancel={() => setShowIngredientForm(false)}
                        />
                    </div>
                </div>
            )}

        </Card>
    );
};

export default AddMenuItem;