import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../../Common/Button/Button';
import { ChevronDown, ChevronUp, CircleX, Pencil, Save } from 'lucide-react';
import GlobalField from "../../../../Common/inputs/GlobalField";
import Card from "../../../../Common/Card/Card";
import IngredientsList from './IngredientsList';
import {useUserContext} from "../../../../../contexts/UserContext";
import * as Yup from 'yup';
import {ingredientSchema} from "../../../../../validationSchemas/ingredientSchema";

const MenuItem = ({ item, onUpdate, onRemove }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showIngredients, setShowIngredients] = useState(false);
    const {userBaseData: user} = useUserContext();

    const menuItemSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required')
            .min(2, 'Name must be at least 2 characters')
            .max(50, 'Name must be less than 50 characters'),
        price: Yup.number()
            .required('Price is required')
            .min(0, 'Price must be positive')
            .max(1000000, 'Price is too high'),
        description: Yup.string()
            .required('Description is required')
            .min(10, 'Description must be at least 10 characters')
            .max(500, 'Description must be less than 500 characters'),
        ingredients: Yup.array().of(ingredientSchema)
    });


    const handleSubmit = (values) => {
        if (isEditing) {
            onUpdate(values);
        }
        setIsEditing(!isEditing);
    };

    return (
        <Card className="rounded-lg h-fit p-3 mb-4 border-2 border-secondary">
            <Formik
                initialValues={item}
                onSubmit={handleSubmit}
                validationSchema={menuItemSchema}
                enableReinitialize={true}
            >
                {({ values, setFieldValue }) => (
                    <Form className="pt-3">
                        <div className="flex justify-between items-center mb-2">
                            <GlobalField
                                label="Name"
                                type="text"
                                name="name"
                                className="text-titles text-xl font-semibold"
                                disabled={!isEditing}
                            />
                            <GlobalField
                                label="Price (₪)"
                                type="number"
                                name="price"
                                className="text-lg font-medium text-primary"
                                disabled={!isEditing}
                            />
                        </div>
                        <GlobalField
                            label="Description"
                            type="text"
                            name="description"
                            className="text-gray mt-2 leading-relaxed"
                            disabled={!isEditing}
                        />
                        <div className="grid grid-cols-2 gap-5">
                            <Button
                                type={isEditing ? "submit" : "button"}
                                onClick={() => {
                                    !isEditing && setIsEditing(true)
                                    setShowIngredients(true)
                                }}
                                className="flex flex-row justify-center px-4 py-2 text-sm font-medium border border-lime rounded-md"
                            >
                                {isEditing ? 'Save' : 'Edit'}
                                {isEditing ? <Save size={20} className="ml-2"/> : <Pencil size={20} className="ml-2"/>}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => onRemove(item.id)}
                                className="flex flex-row justify-center px-4 py-2 text-sm font-medium text-errorRed border rounded-md hover:bg-errorLightRed hover:text-errorRed transition-colors"
                            >
                                Remove
                                <CircleX size={20} className="ml-2"/>
                            </Button>
                        </div>
                        {user?.accountType === 'restaurant-manager' && (
                            <div className="flex items-center justify-between mt-4">
                                <Button
                                    type="button"
                                    onClick={() => setShowIngredients(!showIngredients)}
                                    className="text-md flex flex-row"
                                >
                                    {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
                                    {showIngredients ? <ChevronUp size={20} className="mt-0.5"/> :
                                        <ChevronDown size={20} className="mt-0.5"/>}
                                </Button>
                            </div>
                        )}

                        <div className={`overflow-hidden ${showIngredients ? 'max-h-fit' : 'max-h-0'}`}>
                            {showIngredients && (
                                <IngredientsList
                                    ingredients={values.ingredients}
                                    isEditing={isEditing}
                                    setFieldValue={setFieldValue}
                                />
                            )}
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default MenuItem;
