import React from 'react';
import { FieldArray } from 'formik';
import Button from '../../../../Common/Button/Button';
import { CircleX, Plus } from 'lucide-react';
import IngredientForm from './IngredientForm';

const IngredientsList = ({ ingredients, isEditing, setFieldValue }) => {
    const initialIngredient = {
        id: Date.now(),
        name: '',
        amount: 0,
        unit: '',
        storageType: '',
        pricePerUnit: 0,
        category: '',
        kosherStatus: '',
        allergens: [],
        minStockLevel: 0
    };

    return (
        <FieldArray name="ingredients">
            {({ remove, push }) => (
                <div className="mt-4 space-y-4 h-fit">
                    <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                    {ingredients.map((ingredient, index) => (
                        <div
                            key={ingredient.id || index}
                            className="relative"
                            style={{ opacity: ingredient.removed ? 0 : 1 }}
                        >
                            <IngredientForm
                                index={index}
                                isEditing={isEditing}
                                prefix="ingredients"
                            />
                            {isEditing && (
                                <Button
                                    type="button"
                                    className="absolute top-2 right-2 text-errorRed"
                                    onClick={() => {
                                        setFieldValue(`ingredients.${index}.removed`, true);
                                        setTimeout(() => remove(index), 300);
                                    }}
                                >
                                    <CircleX size={20} />
                                </Button>
                            )}
                        </div>
                    ))}
                    {isEditing && (
                        <Button
                            type="button"
                            onClick={() => push(initialIngredient)}
                            className="border border-lime flex items-center justify-center w-full p-2"
                        >
                            Add Ingredient
                            <Plus size={20} className="ml-2" />
                        </Button>
                    )}
                </div>
            )}
        </FieldArray>
    );
};

export default IngredientsList;
