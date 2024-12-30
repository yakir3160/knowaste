import React, {useEffect, useState} from "react";
import Card from "../../Common/Card/Card";
import Button from "../../Common/Button/Button";
import IngredientForm from "./Menu/IngredientForm";
import { Plus, Pencil, CircleX } from 'lucide-react';
import { useItemsContext } from "../../../contexts/ItemsContext";
import useFilteredItems from "../../../Hooks/Items/useFilteredItems";
import ConfirmDelete from "../../Common/ConfirmDelete/ConfirmDelete";
import InventoryOrderForm from "./InventoryOrderForm";

const Inventory = ({isEmpty}) => {
    const { inventoryItems ,inventoryCategories,itemsError,successMessage,clearMessages,deleteInventoryItem} = useItemsContext();
    const { filteredItems, selectedCategory, setSelectedCategory } = useFilteredItems(inventoryItems, inventoryCategories);
    const [showIngredientForm, setShowIngredientForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [fromOrder, setFromOrder] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setShowIngredientForm(true);
    };

    const handleFormClose = () => {
        setShowIngredientForm(false);
        setSelectedProduct(null);
    };

    const handleDeleteClick = (product) => {
        setProductToDelete(product); // Save the product to be deleted
        setShowDelete(true);
    };

    const confirmDelete = (productId) => {
        console.log("Deleted product:", productId);
        deleteInventoryItem(productId);
        setShowDelete(false);
        setProductToDelete(null);
    };


    return (
        <>
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
                <div
                    className="bg-secondary self-center rounded-t-sm w-full md:w-fit  flex flex-row overflow-x-hidden scrollbar-thin scrollbar-thumb-gray scrollbar-track-transparent">
                    {inventoryCategories.map(category => (
                        <button
                            key={category}
                            className={`px-6 py-3 rounded-t-sm font-semibold ${selectedCategory === category ? 'bg-white text-buttons' : ''} w-full`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>


                <div className="w-full flex flex-col bg-white p-5 rounded-b-sm">
                    <div className="w-full gap-3 grid grid-cols-1">
                        {isEmpty && (
                            <div className="text-titles text-xl text-center">
                                <p>Your inventory is currently empty.</p>
                                <p>Start by adding some items.</p>
                            </div>
                        )}
                        {filteredItems.map((product) => (
                            <Card key={product.id} className="bg-white rounded-lg p-5 space-y-3 ">

                                <button
                                    onClick={() => handleDeleteClick(product)}
                                    className="text-errorRed hover:text-errorRed-dark px-2"
                                >
                                    <CircleX/>
                                </button>
                                <ConfirmDelete
                                    isOpen={showDelete}
                                    onClose={() => setShowDelete(false)}
                                    onConfirm={() => confirmDelete(product.ingredientId)}
                                    name={product.name}
                                />
                                <div className="flex justify-between items-center">
                                    <strong className="text-titles text-2xl font-semibold">{product.name}</strong>
                                    <span className="text-lg">{product.category}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg">
                                        Stock: <span className="font-semibold">{product.stock}</span>
                                        ({product.unit})
                                    </span>
                                    <span className="text-lg">
                                        Price: <span className="font-semibold">₪{product.pricePerUnit}</span>
                                    </span>
                                    <div className="grid grid-cols-1 md:grid-cols-3 text-nowrap gap-2 ">
                                        <Button
                                            onClick={() => {
                                                handleEditClick(product)
                                                window.scrollTo(0, 0);
                                            }}
                                            className="bg-secondary  py-2 px-4  rounded-lg hover:bg-secondary-dark transition duration-300 flex flex-row"
                                        >
                                            Edit
                                            <Pencil size={18} className="ml-3"/>
                                        </Button>
                                        <Button
                                            className="bg-lime py-2 px-4 rounded-lg hover:bg-lime-dark transition duration-300"
                                            onClick={() => {
                                                setFromOrder(true);
                                                setSelectedProduct(product);
                                                window.scrollTo(0, 0);
                                            }}
                                        >
                                            Add Stock
                                        </Button>
                                    </div>
                                </div>
                                {fromOrder && (
                                    <InventoryOrderForm
                                        onCancel={() => setFromOrder(false)}
                                        ingredient={selectedProduct}
                                    />
                                )}
                            </Card>

                        ))}
                    </div>

                </div>
            </div>
        </>
    );
};

export default Inventory;
