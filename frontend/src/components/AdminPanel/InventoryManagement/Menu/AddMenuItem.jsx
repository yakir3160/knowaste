import React, {useState} from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../Common/Button/Button';
import { Save, CircleX } from 'lucide-react';
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from "../../../Common/Card/Card";
import menuItemSchema from '../../../../schemas/firestoreSchemas/menuItemSchema';
import { v4 as generateUniqueID } from 'uuid';

const AddMenuItem = ({ onAdd, categories }) => {
    const [newCategory, setNewCategory] = useState(false);
    const initialValues = {
        categoryName: '',
        subCategoryName: '',
        name: '',
        price: 0,
    };

    const handleSubmit = (values, { resetForm }) => {
        console.log('values', values);
        const newItem = {
            ...values,
            id: generateUniqueID(),
            categoryId: newCategory
                ? generateUniqueID()
                : categories.find(category => category.name === values.categoryName)?.id,
        }
        console.log('new item', newItem);
        onAdd(newItem);
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
                                {
                                    newCategory ? (
                                        <GlobalField
                                            label="Category Name"
                                            type="text"
                                            name="categoryName"
                                            className="text-titles font-medium"
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
                                    )
                                }
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
                                />
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
        </Card>
    );
};

export default AddMenuItem;