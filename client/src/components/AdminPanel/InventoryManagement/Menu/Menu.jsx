import React, { useEffect, useState } from "react";
import MenuItem from "./MenuItem";
import useFilteredItems from "../../../../Hooks/Items/useFilteredItems";
import Button from "../../../Common/Button/Button";
import { Plus } from "lucide-react";
import AddMenuItem from "./AddMenuItem";
import { useItemsContext } from "../../../../context/ItemsContext";
import CategoryDropdown from "../../../Common/CategoryDropdown";

const Menu = ({ isEmpty }) => {
    const { menuItems, menuCategories } = useItemsContext();
    const {
        filteredItems,
        selectedCategory,
        setSelectedCategory,
    } = useFilteredItems(menuItems, menuCategories);
    const [showAddMenuItem, setShowAddMenuItem] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [fromMenuItem, setFromMenuItem] = useState(false);

    const handleAddItem = (newItem) => {
        console.log(newItem);
        setShowAddMenuItem(false);
    };

    useEffect(() => {
        if (menuCategories.length > 0 && !selectedCategory) {
            setSelectedCategory(menuCategories[0]?.name);
        }
    }, [menuCategories]);

    const handleFormClose = () => {
        setShowAddMenuItem(false);
        setSelectedItem(null);
        setFromMenuItem(false);
    };

    return (
        <div className="flex flex-col h-full w-full justify-center items-center">
            {!showAddMenuItem ? (
                <>
                    <Button
                        className="w-fit m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                        onClick={() => setShowAddMenuItem(true)}
                    >
                        Add Menu Item
                        <Plus size={22}/>
                    </Button>
                    <CategoryDropdown
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        inventoryCategories={menuCategories.map((category) => category.name)}
                    />
                    <div className="w-full flex flex-col bg-white p-5 rounded-b-sm md:rounded-sm">
                        <div className="w-full gap-3 grid grid-cols-1">
                            {isEmpty && (
                                <div className="text-titles text-xl text-center">
                                    <p>Your menu is currently empty.</p>
                                    <p>Start by adding some items to your menu.</p>
                                </div>
                            )}
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
                </>
            ) : (
                <AddMenuItem
                    initialValues={selectedItem?.item}
                    isFromMenuItem={fromMenuItem}
                    onAdd={() => {
                        handleAddItem();
                        handleFormClose();
                    }}
                    categories={menuCategories}
                    onCancel={handleFormClose}
                />
            )}
        </div>
    );
};

export default Menu;