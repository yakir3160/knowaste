import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../../../Common/Button/Button';
import { CircleX, Pencil, Save } from 'lucide-react';
import GlobalField from "../../../../../Common/inputs/GlobalField";

const MenuItem = ({ item, onUpdate, onRemove }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showIngredients, setShowIngredients] = useState(false);

    const handleEditToggle = (values) => {
        if (isEditing) {
            onUpdate(values);
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="rounded-lg p-6 mb-4 border-2 border-secondary">
            <Formik
                initialValues={item}
                onSubmit={(values) => handleEditToggle(values)}
            >
                {({ values }) => (
                    <Form>
                        <div className="flex justify-between items-center mb-2">
                            <GlobalField
                                label={'Name'}
                                type="text"
                                name="name"
                                className="text-titles text-xl font-semibold"
                                disabled={!isEditing}
                            />
                            <GlobalField
                                label={'Price'}
                                type="number"
                                name="price"
                                className="text-lg font-medium text-primary"
                                disabled={!isEditing}
                            />
                        </div>
                        <GlobalField
                            label={'Description'}
                            type="text"
                            name="description"
                            className="text-gray-600 mt-2 leading-relaxed"
                            disabled={!isEditing}
                        />
                        <Button
                            onClick={() => setShowIngredients(!showIngredients)}
                            className="mt-2 text-sm font-medium"
                        >
                            {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
                        </Button>
                        {showIngredients && (
                            <div
                                className={`mt-4 overflow-hidden transition-all duration-500 ease-in-out ${showIngredients ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                                {item.ingredients.map((ingredient, index) => (
                                    <GlobalField
                                        key={index}
                                        type="text"
                                        name={`ingredients[${index}]`}
                                        className="text-buttons text-sm"
                                        disabled={!isEditing}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
                            <Button
                                type="submit"
                                className="flex flex-row justify-center px-4 py-2 text-sm font-medium text-blue-600  border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                            >
                                {isEditing ? 'Save' : 'Update'}
                                {isEditing ? <Save size={20} className="ml-2" /> : <Pencil size={20} className="ml-2" />}
                            </Button>
                            <Button
                                onClick={() => onRemove(item)}
                                className="flex flex-row justify-center px-4 py-2 text-sm font-medium text-errorRed border border-errorRed rounded-md hover:bg-errorLightRed hover:text-errorRed transition-colors"
                            >
                                Remove
                                <CircleX size={20} className="ml-2" />
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default MenuItem;