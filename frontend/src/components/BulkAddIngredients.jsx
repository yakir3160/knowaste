import React, { useState } from 'react';
import { ingredients } from '../MockData/Ingredeints';
import { useItemsContext } from '../contexts/ItemsContext';
import { v4 as generateUniqueID } from 'uuid';
import Button from './Common/Button/Button';

const BulkAddIngredients = () => {
    const { addInventoryItem } = useItemsContext();
    const [isLoading, setIsLoading] = useState(false);

    const handleBulkAdd = async () => {
        setIsLoading(true);

        for (const ingredient of ingredients) {
            const formattedIngredient = {
                ingredientId: generateUniqueID(),
                name: ingredient.name,
                categoryName: ingredient.categoryId.charAt(0).toUpperCase() + ingredient.categoryId.slice(1),
                storageType: ingredient.storageType,
                pricePerUnit: ingredient.pricePerUnit,
                quantityPerUnit: ingredient.quantityPerUnit,
                unit: ingredient.unit,
                allergens: ingredient.allergens
            };

            try {
                await addInventoryItem(formattedIngredient);
                console.log(`Added: ${ingredient.name}`);
            } catch (error) {
                console.log(`Failed to add: ${ingredient.name}`);
            }
        }

        setIsLoading(false);
    };

    return (
        <Button
            onClick={handleBulkAdd}
            disabled={isLoading}
            className="bg-lime"
        >
            {isLoading ? 'Adding...' : 'Add All Ingredients'}
        </Button>
    );
};

export default BulkAddIngredients;
