import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import Button from '../../../../../Common/Button/Button';
import {ChevronDown, ChevronUp, CircleX, Pencil, Save} from 'lucide-react';
import GlobalField from "../../../../../Common/inputs/GlobalField";
import Card from "../../../../../Common/Card/Card";

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
        <Card className="rounded-lg p-3 mb-4 border-2 border-secondary  ">
            <Formik
                initialValues={item}
                onSubmit={(values) => handleEditToggle(values)}
            >
                {({ values }) => (
                    <Form className={`pt-3`}>
                        <div className="flex justify-between items-center mb-2">
                            <GlobalField
                                label={'Name'}
                                type="text"
                                name="name"
                                className="text-titles text-xl font-semibold"
                                disabled={!isEditing}
                            />
                            <GlobalField
                                label={'Price (₪)'}
                                type="number"
                                name="price"
                                className="text-lg font-medium text-primary "
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
                            className=" text-md flex flex-row"

                        >
                            {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
                            {showIngredients ? <ChevronUp size={20} className={`mt-0.5`}/> : <ChevronDown size={20} className={`mt-0.5`}/>}
                        </Button>
                        {showIngredients && (
                            <div
                                className={` mt-4 overflow-y-scroll transition-all duration-500 ease-in-out ${showIngredients ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                            >
                                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                                {item.ingredients.map((ingredient) => (
                                    <div className={`grid grid-cols-5 gap-3`}>
                                        <div className=" col-span-3">
                                            <GlobalField
                                                label={'Name'}
                                                key={ingredient.id}
                                                value={ingredient.name}
                                                type="text"
                                                name={`ingredients[${ingredient.id}]`}
                                                className="text-buttons text-sm "
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <div className=" col-span-1">
                                            <GlobalField
                                                label={'Amount (g)'}
                                                key={ingredient.id}
                                                value={ingredient.amountInGrams}
                                                type="number"
                                                name={`ingredientAmounts[${ingredient.id}]`}
                                                className="text-buttons text-sm w-25 "
                                                disabled={!isEditing}
                                            />

                                        </div>
                                        <div className="text-sm flex justify-center items-center col-span-1">
                                            <button className={`${isEditing ? ' text-errorRed ' : 'text-errorLightRed'}`} disabled={!isEditing}>
                                                <CircleX size={20}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
                            <Button
                                type="submit"
                                className="flex flex-row justify-center px-4 py-2 text-sm font-medium border border-lime rounded-md "
                            >
                                {isEditing ? 'Save' : 'Update'}
                                {isEditing ? <Save size={20} className="ml-2" /> : <Pencil size={20} className="ml-2" />}
                            </Button>
                            <Button
                                onClick={() => onRemove(item)}
                                className="flex flex-row justify-center px-4 py-2 text-sm font-medium text-errorRed border rounded-md hover:bg-errorLightRed hover:text-errorRed transition-colors"
                            >
                                Remove
                                <CircleX size={20} className="ml-2" />
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default MenuItem;