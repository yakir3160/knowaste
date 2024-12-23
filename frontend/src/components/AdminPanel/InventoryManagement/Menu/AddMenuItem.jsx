import React from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../Common/Button/Button';
import { Save, CircleX } from 'lucide-react';
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from "../../../Common/Card/Card";
import menuItemSchema from '../../../../schemas/firestoreSchemas/menuItemSchema';
import IngredientsList from "./IngredientsList";

const AddMenuItem = ({ onAdd, categories, userId }) => {
    const initialValues = {
        userId: userId,
        menuItemData: {
            name: '',
            price: 0,
            ingredients: []
        }
    };

    const handleSubmit = (values, { resetForm }) => {
        onAdd(values);
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
                        <div className="flex justify-between items-center mb-2">
                            <GlobalField
                                label="Name"
                                type="text"
                                name="menuItemData.name"
                                className="text-titles text-xl font-semibold mb-2"
                                autoFocus={true}
                            />
                            <GlobalField
                                label="Price (₪)"
                                type="number"
                                name="menuItemData.price"
                                className="text-lg font-medium text-primary mb-2"
                            />
                        </div>
                        <IngredientsList
                            ingredients={values.menuItemData.ingredients}
                            isEditing={true}
                            setFieldValue={(ingredients) =>
                                setFieldValue('menuItemData.ingredients', ingredients)
                            }
                        />
                        <div className="flex mt-4">
                            <Button
                                type="submit"
                                className="flex justify-center items-center w-full px-4 py-2 text-sm font-medium border border-lime rounded-md col-span-full"
                            >
                                Save
                                <Save size={20} className="ml-2" />
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default AddMenuItem;
