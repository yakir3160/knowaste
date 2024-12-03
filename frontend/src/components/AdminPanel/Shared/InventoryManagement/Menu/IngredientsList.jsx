import React from 'react';
import { FieldArray } from 'formik';
import GlobalField from "../../../../Common/inputs/GlobalField";
import Button from '../../../../Common/Button/Button';
import { CircleX, Plus } from 'lucide-react';
import {useItemsContext} from "../../../../../contexts/ItemsContext";

const IngredientsList = ({ ingredients, isEditing, setFieldValue }) => {
const {ingredientCategories} = useItemsContext();
    return (
        <FieldArray name="ingredients">
            {({ remove, push }) => (
                <div className="mt-4 overflow-y-scroll ">
                    <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                    {ingredients.map((ingredient, index) => (
                        <div
                            key={ingredient.id || index}
                            className="grid grid-cols-1 md:grid-cols-4 mb-2  space-x-2"
                            style={{ opacity: ingredient.removed ? 0 : 1 }}
                        >
                                <GlobalField
                                    label="Name"
                                    type="text"
                                    name={`ingredients.${index}.name`}
                                    className="text-buttons text-sm"
                                    disabled={!isEditing}
                                    autoFocus={index === ingredients.length - 1}
                                />
                                <GlobalField
                                    label="Category"
                                    type="select"
                                    name={`ingredients.${index}.category`}
                                    className="text-buttons text-sm"
                                    disabled={!isEditing}
                                    options={[{value : '' ,label : 'Select a Category'},...ingredientCategories.map(category => ({ value: category.name, label: category.name }))]}
                                />
                                <GlobalField
                                    label="Amount (g)"
                                    type="number"
                                    name={`ingredients.${index}.amountInGrams`}
                                    className="text-buttons text-sm w-25"
                                    disabled={!isEditing}
                                />
                            <div className="text-sm flex justify-end lg:justify-center items-center ">
                                <Button
                                    type="button"
                                    className={`${isEditing ? 'text-errorRed' : 'text-errorLightRed'}`}
                                    disabled={!isEditing}
                                    onClick={() => {
                                        if (isEditing) {
                                            setFieldValue(`ingredients.${index}.removed`, true);
                                            setTimeout(() => remove(index), 300); // Wait for fade-out before removal
                                        }
                                    }}
                                >
                                    <CircleX size={20} />
                                </Button>
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
};

export default IngredientsList;
