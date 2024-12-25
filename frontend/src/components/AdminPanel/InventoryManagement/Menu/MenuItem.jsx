import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../Common/Button/Button';
import { ChevronDown, ChevronUp, CircleX, Pencil, Save } from 'lucide-react';
import GlobalField from "../../../Common/inputs/GlobalField";
import Card from "../../../Common/Card/Card";
import IngredientsList from './IngredientsList';
import {useUserContext} from "../../../../contexts/UserContext";
import * as Yup from 'yup';
import menuItemSchema from '../../../../schemas/firestoreSchemas/menuItemSchema';

const MenuItem = ({ item, onUpdate, onRemove }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showIngredients, setShowIngredients] = useState(false);
    const {userBaseData: user} = useUserContext();

const handleSubmit = (values) => {
        if (isEditing) {
            console.log('Updating item:', values);
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
                        <div className="flex items-center justify-between mt-4">
                            <Button
                                type="button"
                                onClick={() => {
                                    setShowIngredients(!showIngredients)
                                    setIsEditing(false)
                                }}
                                className="text-md flex flex-row"
                            >
                                {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
                                {showIngredients ? <ChevronUp size={20} className="mt-0.5"/> :
                                    <ChevronDown size={20} className="mt-0.5"/>}
                            </Button>
                        </div>
                        <div className={`overflow-hidden ${showIngredients ? 'max-h-fit' : 'max-h-0'}`}>
                            {showIngredients && (
                                <IngredientsList
                                    ItemIngredients={item.ingredients}
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
