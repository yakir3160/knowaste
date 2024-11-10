import React from 'react';
import { FieldArray } from 'formik';
import GlobalField from "../../../../../Common/inputs/GlobalField";
import Button from '../../../../../Common/Button/Button';
import { CircleX, Plus } from 'lucide-react';

const IngredientsList = ({ ingredients, isEditing, setFieldValue }) => (
    <FieldArray name="ingredients">
        {({ remove, push }) => (
            <div className="mt-4 overflow-y-scroll ">
                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                {ingredients.map((ingredient, index) => (
                    <div
                        key={ingredient.id || index}
                        className="grid grid-cols-5 mb-2 "
                        style={{ opacity: ingredient.removed ? 0 : 1 }}
                    >
                        <div className="col-span-3">
                            <GlobalField
                                label="Name"
                                type="text"
                                name={`ingredients.${index}.name`}
                                className="text-buttons text-sm"
                                disabled={!isEditing}
                                autoFocus={index === ingredients.length - 1}
                            />
                        </div>
                        <div className="col-span-1">
                            <GlobalField
                                label="Amount (g)"
                                type="number"
                                name={`ingredients.${index}.amountInGrams`}
                                className="text-buttons text-sm w-25"
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="text-sm flex justify-end lg:justify-center items-center col-span-1">
                            <button
                                type="button"
                                className={`${isEditing ? 'text-errorRed' : 'text-errorLightRed'}`}
                                disabled={!isEditing}
                                onClick={() => {
                                    if (isEditing) {
                                        // Mark item as removed for smooth transition
                                        setFieldValue(`ingredients.${index}.removed`, true);
                                        setTimeout(() => remove(index), 300); // Wait for fade-out before removal
                                    }
                                }}
                            >
                                <CircleX size={20} />
                            </button>
                        </div>
                    </div>
                ))}
                {isEditing && (
                    <Button
                        type="button"
                        onClick={() => push({ id: Date.now(), name: '', amountInGrams: 0 })}
                        className={`border border-lime flex flex-row m-2 justify-center`}
                    >
                        Add Ingredient
                        <Plus size={20} className={`ml-2 self-center`} />
                    </Button>
                )}
            </div>
        )}
    </FieldArray>
);

export default IngredientsList;
