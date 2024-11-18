import React, {useEffect, useState} from "react";
import MenuItem from "./MenuItem";
import {useUserItems} from "../../../../../Hooks/User/useUserItems";
import {ChevronsLeftRightEllipsis, Plus} from 'lucide-react'
import Card from "../../../../Common/Card/Card";
import Button from "../../../../Common/Button/Button";

const Menu = ({ userItems = [],categories=[] ,title,}) => {
    const {handleUpdate, handleRemove} = useUserItems();
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || '');
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    const subCategory = categories.find(category => category.name === selectedCategory)?.subCategories || [];
    const categoryItems = userItems.find(category => category.name === selectedCategory)?.dishes || [];
    const filteredItems = selectedSubCategory
        ? categoryItems.find(subCategory => subCategory.subCategoryName === selectedSubCategory)?.items || []
        : categoryItems;

    useEffect(() => {
        setSelectedSubCategory(subCategory?.[0] || null);
    }, [selectedCategory]);


    return (


            <div className="flex flex-col h-fit w-full justify-center items-center">
                <div className="mb-6 w-fit bg-secondary self-center rounded-t-sm">
                    <div className="grid grid-cols-3 grid-rows-2  justify-center">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                className={`px-4 py-4 rounded-t-sm font-semibold 
                            ${selectedCategory === category.name ? 'bg-base border-b-2 border-lime text-buttons' : 'border-b-2 border-transparent'}
                            hover:bg-opacity-10 hover:bg-white transition-colors`}
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div
                    className={`mb-6 w-full lg:w-fit self-center rounded-t-sm grid grid-cols-3 md:grid-cols-${subCategory.length} gap-2 p-2`}>
                    {subCategory?.map(subCategory => (
                        <button
                            key={subCategory.id}
                            className={`p-3 rounded-t-sm text-buttons text-light
                            ${selectedSubCategory === subCategory ? 'bg-white border-b-2 border-lime text-buttons' : 'border-b-2 border-[transparent]'}`}
                            onClick={() => setSelectedSubCategory(subCategory)}
                        >
                            {subCategory}
                        </button>
                    ))}
                </div>
                <div className="w-full gap-2 grid grid-cols-1">
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
    );
};

export default Menu;