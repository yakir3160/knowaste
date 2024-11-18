import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../../Common/Button/Button';
import { ChevronDown, ChevronUp, CircleX, Pencil, Save } from 'lucide-react';
import GlobalField from "../../../../Common/inputs/GlobalField";
import Card from "../../../../Common/Card/Card";
import IngredientsList from './IngredientsList';
import {useUserContext} from "../../../../../contexts/UserContext"; // נייבא את הקומפוננטה החדשה

const MenuItem = ({ item, onUpdate, onRemove }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showIngredients, setShowIngredients] = useState(false);
    const {userBaseData: user} = useUserContext() // יצירת משתנה חדש ושימוש בפונקציה של הקונטקסט

    const handleSubmit = (values) => {
        if (isEditing) {
            onUpdate(values);
        }
        setIsEditing(!isEditing);
    };

    return (
        <Card className="rounded-lg p-3 mb-4 border-2 border-secondary">
            <Formik
                initialValues={item}
                onSubmit={handleSubmit}
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
                        {user?.accountType === 'restaurant-manager' && (
                            <>
                                <Button
                                    type="button"
                                    onClick={() => setShowIngredients(!showIngredients)}
                                    className="text-md flex flex-row"
                                >
                                    {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
                                    {showIngredients ? <ChevronUp size={20} className="mt-0.5"/> :
                                        <ChevronDown size={20} className="mt-0.5"/>}
                                </Button>
                                <div
                                    className={`overflow-hidden  mt-4 ${showIngredients ? 'max-h-screen' : 'max-h-0'}`}
                                >
                                    {showIngredients && (
                                        <IngredientsList
                                            ingredients={values.ingredients}
                                            isEditing={isEditing}
                                            setFieldValue={setFieldValue}
                                        />
                                    )}
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
                            <Button
                                type="submit"
                                className="flex flex-row justify-center px-4 py-2 text-sm font-medium border border-lime rounded-md"
                            >
                                {isEditing ? 'Save' : 'Update'}
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
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default MenuItem;
