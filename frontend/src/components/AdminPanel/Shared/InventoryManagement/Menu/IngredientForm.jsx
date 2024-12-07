import React from 'react';
import GlobalField from "../../../../Common/inputs/GlobalField";
import { useItemsContext } from "../../../../../contexts/ItemsContext";

const IngredientForm = ({ index, isEditing, prefix = "" }) => {
    const { ingredientCategories, ingredientStorageTypes, measurementUnits } = useItemsContext();

    const fieldPrefix = prefix ? `${prefix}.` : "";

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-lg shadow-sm">
                <GlobalField
                    label="Name"
                    type="text"
                    name={`${fieldPrefix}${index}.name`}
                    className="text-buttons text-sm"
                    disabled={!isEditing}
                />
                <GlobalField
                    label="Category"
                    type="select"
                    name={`${fieldPrefix}${index}.category`}
                    className="text-buttons text-sm"
                    disabled={!isEditing}
                    options={[{ value: '', label: 'Select a Category' }, ...ingredientCategories]}
                />
                <GlobalField
                    label="Storage Type"
                    type="select"
                    name={`${fieldPrefix}${index}.storageType`}
                    className="text-buttons text-sm"
                    disabled={!isEditing}
                    options={ingredientStorageTypes}
                />
                <GlobalField
                    label="Amount"
                    type="number"
                    name={`${fieldPrefix}${index}.amount`}
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
                    label="Allergens"
                    type="select"
                    name={`${fieldPrefix}${index}.allergens`}
                    className="text-buttons text-sm"
                    disabled={!isEditing}
                    options={[
                        { value: 'nuts', label: 'Nuts' },
                        { value: 'dairy', label: 'Dairy' },
                        { value: 'eggs', label: 'Eggs' },
                        { value: 'soy', label: 'Soy' },
                        { value: 'wheat', label: 'Wheat' },
                        { value: 'fish', label: 'Fish' },
                        { value: 'shellfish', label: 'Shellfish' }
                    ]}
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
    );
};

export default IngredientForm;
