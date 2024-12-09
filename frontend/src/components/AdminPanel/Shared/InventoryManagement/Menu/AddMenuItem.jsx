import React, {useRef} from 'react';
import { Formik, Form, FieldArray } from 'formik';
import Button from '../../../../Common/Button/Button';
import { Save, PlusCircle, CircleX } from 'lucide-react';
import GlobalField from "../../../../Common/inputs/GlobalField";
import Card from "../../../../Common/Card/Card";
import IngredientsList from './IngredientsList'; // Assuming IngredientsList is in the same directory

const AddMenuItem = ({ onAdd, categories }) => {
    const initialValues = {
        name: '',
        price: 0,
        category: '',
        subCategory: '',
        description: '',
        ingredients: [],
    };

    const handleSubmit = (values, { resetForm }) => {
        onAdd(values);
        resetForm();
    };

    return (
        <Card className=" w-full md:w-3/4 rounded-lg p-3 mb-4 border-2 border-secondary">
            <button
                type="button"
                onClick={() => onAdd() }
                className="flex justify-center items-center shadow-outer-custom text-sm font-medium  rounded-md col-span-full"
            >
                <CircleX size={22} />
            </button>
            <Formik
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="pt-3">
                        <div className="flex justify-between items-center mb-2">
                            <GlobalField
                                label="Name"
                                type="text"
                                name="name"
                                className="text-titles text-xl font-semibold mb-2"
                                autoFocus={true}
                            />
                            <GlobalField
                                label="Price (₪)"
                                type="number"
                                name="price"
                                className="text-lg font-medium text-primary mb-2"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 space-x-2">
                        <GlobalField
                            label="Description"
                            type="text"
                            name="description"
                            className="text-gray mt-2 leading-relaxed"
                        />
                        <GlobalField
                            label="Category"
                            type="select"
                            name="Category"
                            className="text-gray mt-2 leading-relaxed"
                            options={categories.map(category => ({ value: category.name, label: category.name }))}
                        />
                        </div>
                        <IngredientsList
                            ingredients={values.ingredients}
                            isEditing={true}
                            setFieldValue={setFieldValue}
                        />

                        <div className=" flex mt-4">
                            <Button
                                type="submit"
                                className="flex justify-center items-center w-full  px-4 py-2 text-sm font-medium border border-lime rounded-md col-span-full"
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
