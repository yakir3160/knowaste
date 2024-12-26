import React, {useEffect, useState} from "react";
import MenuItem from "./MenuItem";
import { useUserItems } from "../../../../Hooks/User/useUserItems";
import useFilteredItems from "../../../../Hooks/Items/useFilteredItems";
import Button from "../../../Common/Button/Button";
import {Plus} from "lucide-react";
import AddMenuItem from "./AddMenuItem";
import {useItemsContext} from "../../../../contexts/ItemsContext";
import Card from "../../../Common/Card/Card";




const Menu = ({isEmpty}) => {
    const [isAdding, setIsAdding] = useState(false);
    const { handleUpdate, handleRemove } = useUserItems();
    const { userItems, categories,itemsError, successMessage,clearMessages} = useItemsContext();
    const {
        filteredItems,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        subCategories
    } = useFilteredItems(userItems, categories);

    const handleAddItem = (newItem) => {
        console.log(newItem);
        setIsAdding(false);
    };

    useEffect(() => {
        if (itemsError || successMessage) {
            const timer = setTimeout(() => {
                clearMessages();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [itemsError, successMessage]);


    return (
        <div className="flex flex-col h-full w-full justify-center items-center">
            <Button
                className="w-fit m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                onClick={() => setIsAdding(true)}
            >
                Add Menu Item
                <Plus size={22} />
            </Button>
            {itemsError && (
                <span className=" text-errorRed p-3 mb-4 rounded-md">
                    {itemsError}
                </span>
            )}
            {successMessage && (
                <Card className=" text-green p-3 mb-4 rounded-md">
                    {successMessage}
                </Card>
            )}

            {isAdding && (
                <AddMenuItem
                    onAdd={handleAddItem}
                    categories={categories}
                />
            )}
            <div className="w-fit bg-secondary self-center rounded-t-sm">
                <div className={`w-full`}>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`px-6 py-4 rounded-t-sm font-semibold 
                            ${selectedCategory === category.name ? 'bg-white text-buttons' : ''}`}
                            onClick={() => setSelectedCategory(category.name)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`w-full flex flex-col bg-white p-5 rounded-b-sm md:rounded-sm`}>
                <div
                    className={`mb-6 w-full lg:w-fit  flex justify-center overflow-x-scroll self-center`}>
                    {categories?.map(subCategory => (
                        <button
                            key={subCategory.id}
                            className={`p-3 rounded-t-sm text-buttons text-light
                                ${selectedSubCategory === subCategory.name ? 'bg-white border-b-2 border-lime text-buttons' : 'border-b-2 border-[transparent]'}`}
                            onClick={() => setSelectedSubCategory(subCategory.subCategoryName)}
                        >
                            {subCategory.subCategoryName}
                        </button>
                    ))}
                </div>

                <div className="w-full gap-3 grid grid-cols-1 md:grid-cols-2  ">
                    {isEmpty &&
                        <div className="text-titles text-xl text-center">
                            <p>Your menu is currently empty.</p>
                            <p>Start by adding some items to your menu.</p>
                        </div>
                    }
                    {filteredItems?.map((item) => (
                        <MenuItem
                            key={item.id}
                            item={item}
                            onUpdate={handleUpdate}
                            onRemove={handleRemove}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Menu;
