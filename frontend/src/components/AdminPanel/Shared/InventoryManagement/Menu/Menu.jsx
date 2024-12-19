import React from "react";
import MenuItem from "./MenuItem";
import { useUserItems } from "../../../../../Hooks/User/useUserItems";
import useFilteredItems from "../../../../../Hooks/Items/useFilteredItems";




const Menu = ({ userItems = [], categories = [] }) => {
    const { handleUpdate, handleRemove } = useUserItems();
    const {
        filteredItems,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        subCategories
    } = useFilteredItems(userItems, categories); // משתמשים ב-hook
    return (
        <div className="flex flex-col h-full w-full justify-center items-center">
            <div className="w-fit bg-secondary self-center rounded-t-sm">
                <div className={`w-full`}>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            className={`px-4 py-4 rounded-t-sm font-semibold 
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
                    {subCategories?.map(subCategory => (
                        <button
                            key={subCategory.id}
                            className={`p-3 rounded-t-sm text-buttons text-light
                                ${selectedSubCategory === subCategory.name ? 'bg-white border-b-2 border-lime text-buttons' : 'border-b-2 border-[transparent]'}`}
                            onClick={() => setSelectedSubCategory(subCategory.name)}
                        >
                            {subCategory.name}
                        </button>
                    ))}
                </div>

                <div className="w-full gap-3 grid grid-cols-1  ">
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
