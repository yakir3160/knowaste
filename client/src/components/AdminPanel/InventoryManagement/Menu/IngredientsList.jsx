import React from 'react';
import { FieldArray, useFormikContext } from 'formik';
import Button from '../../../Common/Button/Button';
import { CircleX } from 'lucide-react';
import GlobalField from "../../../Common/inputs/GlobalField";
import { useItemsContext } from "../../../../context/ItemsContext";

const IngredientsList = ({ isEditing }) => {
    const { values, setFieldValue } = useFormikContext();

    const handleQuantityChange = (ingredientId, newValue) => {
        const ingredients = values.ingredients.map(ing => {
            if (ing.ingredientId === ingredientId) {
                return { ...ing, quantity: newValue };
            }
            console.log(ing)
            return ing;
        });
        setFieldValue('ingredients', ingredients);
    };

    return (
        <FieldArray name="ingredients">
            {({ remove }) => (
                <div className="mt-4 space-y-4 border-2 border-secondary p-2 rounded-sm">
                    <h2 className="text-xl text-titles font-semibold mb-4 px-2">Ingredients</h2>
                    {values.ingredients.map((ingredient, index) => {
                        return (
                            <div key={ingredient.ingredientId} className="relative flex items-center gap-4 p-3 border-2 border-secondary rounded-sm">
                                <div className="flex-1">
                                    <p className="font-medium">{ingredient.name}</p>
                                </div>

                                <div className="w-32">
                                    <GlobalField
                                        label="Amount"
                                        type="number"
                                        name={`ingredients.${index}.quantity`}
                                        disabled={!isEditing}
                                        className="text-sm"
                                        onChange={(e) => handleQuantityChange(ingredient.ingredientId, e.target.value)}
                                    />
                                </div>

                                <div className="w-24">
                                    <p className="text-sm text-gray-600">{ingredient?.unit}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </FieldArray>
    );
};

export default IngredientsList;
