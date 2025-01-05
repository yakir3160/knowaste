import React, { useState } from "react";
import Button from "../../../Common/Button/Button";
import IngredientForm from "../Menu/IngredientForm";
import { Plus } from 'lucide-react';
import { useItemsContext } from "../../../../contexts/ItemsContext";
import useFilteredItems from "../../../../Hooks/Items/useFilteredItems";
import BulkAddIngredients from "../../../BulkAddIngredients";
import CategoryDropdown from "../../../Common/CategoryDropdown";
import InventoryItem from "../Inventory/InventoryItem";

const Inventory = ({isEmpty}) => {
    const { inventoryItems, inventoryCategories, deleteInventoryItem } = useItemsContext();
    const { filteredItems, selectedCategory, setSelectedCategory } = useFilteredItems(inventoryItems, inventoryCategories);
    const [showIngredientForm, setShowIngredientForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setShowIngredientForm(true);
    };

    const handleFormClose = () => {
        setShowIngredientForm(false);
        setSelectedProduct(null);
    };

    return (
        <>
            {/*<BulkAddIngredients />*/}
            <div className="w-full h-fit">
                <div className="flex justify-center">
                    <Button
                        onClick={() => setShowIngredientForm(true)}
                        className="w-fit m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                    >
                        Add New Item
                        <Plus size={24} />
                    </Button>
                </div>

                {showIngredientForm && (
                    <IngredientForm
                        initialValues={selectedProduct}
                        onCancel={handleFormClose}
                        isEditing={!!selectedProduct}
                        onSubmit={(values) => {
                            console.log('Form submitted:', values);
                            handleFormClose();
                        }}
                    />
                )}
            </div>

            <div className="flex flex-col h-full w-full justify-center items-center">
                <CategoryDropdown
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    inventoryCategories={inventoryCategories}
                />

                <div className="w-full flex flex-col bg-white p-5 rounded-b-sm">
                    <div className="w-full gap-3 grid grid-cols-1">
                        {isEmpty && (
                            <div className="text-titles text-xl text-center">
                                <p>Your inventory is currently empty.</p>
                                <p>Start by adding some items.</p>
                            </div>
                        )}
                        {filteredItems.map((product) => (
                            <InventoryItem
                                key={product.ingredientId}
                                product={product}
                                onEdit={handleEditClick}
                                deleteInventoryItem={deleteInventoryItem}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Inventory;