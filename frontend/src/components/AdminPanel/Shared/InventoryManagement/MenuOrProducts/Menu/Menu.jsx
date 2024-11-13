import React, { useState } from "react";
import MenuItem from "./MenuItem";
import {useUserItems} from "../../../../../../Hooks/User/useUserItems";

const Menu = ({ userItems,categories }) => {
    const {handleUpdate, handleRemove} = useUserItems();
    const [selectedCategory, setSelectedCategory] = useState(categories.categories[0]);

    // const [selectedSubCategory, setSelectedSubCategory] = useState(categories[0].subCategories[0]);
    // const filteredItems = userItems.filter(item => item.category === selectedCategory && item.subCategory === selectedSubCategory);
    // const [selectedSubCategory, setSelectedSubCategory] = useState(subCategories[0]);
    // const filteredItems = userItems.filter(item => item.category === selectedCategory && item.subCategory === selectedSubCategory);

    return (
        <div className="flex flex-col h-fit w-full justify-center items-center">
            <div className="mb-6 bg-secondary lg:w-fit self-center rounded-t-sm   grid grid-cols-2 md:grid-cols-4">
                {categories.categories.map(category => (
                    <button
                        key={category.id}
                        className={`px-4  py-4 rounded-t-sm font-semibold 
                         ${selectedCategory.name === category.name ? 'bg-base border-b-2 border-lime text-buttons ' : 'border-b-2 border-[transparent]'}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/*<div className={`mb-6 w-full lg:w-fit self-center rounded-t-sm grid grid-cols-2 md:grid-cols-${subCategories?.length}`}>*/}
            {/*    {categories.subCategories?.map(subCategory => (*/}
            {/*        <button*/}
            {/*            key={subCategory}*/}
            {/*            className={`p-3 rounded-t-sm text-buttons text-light*/}
            {/*                ${selectedSubCategory === subCategory ? 'bg-white border-b-2 border-lime text-buttons' : 'border-b-2 border-[transparent]'}`}*/}
            {/*            onClick={() => setSelectedSubCategory(subCategory)}*/}
            {/*        >*/}
            {/*            {subCategory}*/}
            {/*        </button>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/*<div className="w-full gap-2 grid grid-cols-1">*/}
            {/*    {filteredItems.map((item) => (*/}
            {/*        <MenuItem*/}
            {/*            key={item.id}*/}
            {/*            item={item}*/}
            {/*            onUpdate={handleUpdate}*/}
            {/*            onRemove={handleRemove}*/}
            {/*        />*/}
            {/*    ))}*/}
            {/*</div>*/}
        </div>
    );
};

export default Menu;