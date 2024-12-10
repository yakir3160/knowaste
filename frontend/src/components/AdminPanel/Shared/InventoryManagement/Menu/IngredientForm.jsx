import React, { useState } from 'react';
import GlobalField from "../../../../Common/inputs/GlobalField";
import { useItemsContext } from "../../../../../contexts/ItemsContext";
import Button from "../../../../Common/Button/Button";
import {Field} from "formik";

const IngredientForm = ({ index, isEditing, prefix = "" ,newIngredient = false}) => {
    const { ingredients, ingredientCategories, ingredientStorageTypes, measurementUnits } = useItemsContext();

    const [isNewProduct, setIsNewProduct] = useState(newIngredient); // מצב למוצר חדש
    const fieldPrefix = prefix ? `${prefix}.` : "";

    const handleNewProductToggle = () => {
        setIsNewProduct(prevState => !prevState); // משנה אם המוצר חדש או לא
    };
    return (
        <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
            {/* כפתור למוצר חדש */}
            <Button
                onClick={handleNewProductToggle}
                className={`w-full ${isNewProduct ? 'bg-lime ' : 'bg-white '} border border-lime`}
                disabled={!isEditing}
            >
                {isNewProduct ? 'Set as Existing Product' : 'Set as New Product'}
            </Button>

            {/* שדה שם - אם המוצר חדש, זה יהיה טקסט, אחרת זה יהיה בחירה */}
            <GlobalField
                label="Name"
                type={isNewProduct ? "text" : "select"}  // אם המוצר חדש, סוג השדה יהיה טקסט
                name={`${fieldPrefix}${index}.name`}
                className="text-buttons text-sm w-full"
                disabled={!isEditing}
                options={isNewProduct ? [] : [
                    {value: '', label: 'Select or type new ingredient'},
                    ...ingredients.map(ing => ({
                        value: ing.name,
                        label: ing.name
                    }))
                ]}
                allowNewValues={isNewProduct}  // אם המוצר חדש, אפשר להכניס ערך חדש
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlobalField
                    label="Category"
                    type="select"
                    name={`${fieldPrefix}${index}.category`}
                    className="text-buttons text-sm"
                    disabled={!isEditing}
                    options={ingredientCategories}
                />
                <GlobalField
                    label="Storage Type"
                    type="select"
                    name={`${fieldPrefix}${index}.storageType`}
                    className="text-buttons text-sm"
                    disabled={!isEditing}
                    options={ingredientStorageTypes}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlobalField
                    label="Amount"
                    type="number"
                    name={`${fieldPrefix}${index}.amountPerDish`}
                    className="text-buttons text-sm"
                    disabled={!isEditing}
                    min="0"
                />
                <GlobalField
                    label="Unit"
                    type="select"
                    name={`${fieldPrefix}${index}.unit`}
                    className="text-buttons text-sm"
                    disabled={!isEditing}
                    options={measurementUnits}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GlobalField
                    label="Price per Unit"
                    type="number"
                    name={`${fieldPrefix}${index}.pricePerUnit`}
                    className="text-buttons text-sm"
                    disabled={!isEditing}
                    min="0"
                    step="0.01"
                />

                <GlobalField
                    label="Minimum Stock Level"
                    type="number"
                    name={`${fieldPrefix}${index}.minStockLevel`}
                    className="text-buttons text-sm"
                    disabled={!isEditing}
                    min="0"
                />

            </div>
            <div className="space-y-2 border-2 border-lime rounded-sm p-4 ">
                <label className="block text-sm font-medium  text-gray">Allergens</label>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        {value: 'nuts', label: 'Nuts'},
                        {value: 'dairy', label: 'Dairy'},
                        {value: 'eggs', label: 'Eggs'},
                        {value: 'soy', label: 'Soy'},
                        {value: 'wheat', label: 'Wheat'},
                        {value: 'fish', label: 'Fish'},
                        {value: 'shellfish', label: 'Shellfish'}
                    ].map((allergen) => (
                        <label key={allergen.value} className="flex items-center space-x-2">
                            <Field
                                type="checkbox"
                                name={`${fieldPrefix}${index}.allergens`}
                                value={allergen.value}
                                disabled={!isEditing}
                                className="form-checkbox h-4 w-4 bg-lime rounded border-lime focus:ring-lime"
                            />
                            <span className="text-sm">{allergen.label}</span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default IngredientForm;
