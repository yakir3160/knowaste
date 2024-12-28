import React, {useEffect, useState} from "react";
import MenuItem from "./MenuItem";
import { useUserItems } from "../../../../Hooks/User/useUserItems";
import useFilteredItems from "../../../../Hooks/Items/useFilteredItems";
import Button from "../../../Common/Button/Button";
import {Plus} from "lucide-react";
import AddMenuItem from "./AddMenuItem";
import {useItemsContext} from "../../../../contexts/ItemsContext";


const Menu = ({isEmpty}) => {
    const { userItems, categories,itemsError, successMessage,clearMessages} = useItemsContext();
    const {
        filteredItems,
        selectedCategory,
        setSelectedCategory,
    } = useFilteredItems(userItems, categories);
    const [showAddMenuItem, setShowAddMenuItem] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [fromMenuItem, setFromMenuItem] = useState(false);

    const handleAddItem = (newItem) => {
        console.log(newItem);
        setShowAddMenuItem(false);
    };


    const handleFormClose = () => {
        setShowAddMenuItem(false);
        setSelectedItem(null);
    };


    return (
        <div className="flex flex-col h-full w-full justify-center items-center">
            <Button
                className="w-fit m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                onClick={() => setShowAddMenuItem(true)}
            >
                Add Menu Item
                <Plus size={22}/>
            </Button>
            {showAddMenuItem && (
                <AddMenuItem
                    initialValues={selectedItem.item}
                    isFromMenuItem={fromMenuItem}
                    onAdd={() => {
                        handleAddItem();
                        handleFormClose();
                    }}
                    categories={categories}
                    onCancel={handleFormClose}
                />
            )}

                <div
                    className="  bg-secondary self-center  rounded-t-sm w-full md:w-fit flex flex-row overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
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


            <div className={`w-full flex flex-col bg-white p-5 rounded-b-sm md:rounded-sm`}>

                <div className="w-full gap-3 grid grid-cols-1 ">
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
                            onEdit={(item) => {
                                setSelectedItem(item);
                                setShowAddMenuItem(true);
                                setFromMenuItem(true);
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Menu;
