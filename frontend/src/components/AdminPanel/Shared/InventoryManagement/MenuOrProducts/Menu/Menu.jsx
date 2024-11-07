import React, { useState } from "react";
import MenuItem from "./MenuItem";

const Menu = ({ items }) => {
    const [selectedCategory, setSelectedCategory] = useState("Appetizers");
    const [selectedSubCategory, setSelectedSubCategory] = useState("Meat");

    const categories = ["Appetizers", "Main Courses", "Desserts", "Drinks"];
    const mainCourses = items.filter(item => item.category === "Main Courses");
    const mainSubCategories = Array.from(new Set(mainCourses.map(item => item.subCategory))).sort();

    const filteredItems = selectedCategory === 'Main Courses'
        ? mainCourses.filter(item => item.subCategory === selectedSubCategory)
        : items.filter(item => item.category === selectedCategory);

    const handleUpdate = (item) => {
        console.log(`${item.name} Updated`);
    };

    const handleRemove = (item) => {
        console.log(`${item.name} Deleted`);
    };

    return (
        <div className="flex flex-col w-full justify-center items-center">
            <div className="mb-6 bg-secondary lg:w-fit self-center rounded-t-sm   grid grid-cols-2 md:grid-cols-4">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`p-3 rounded-t-sm font-semibold transform transition-all duration-300 
                         ${selectedCategory === category ? 'bg-base border-b-2 border-lime text-buttons scale-110' : 'border-b-2 border-[transparent]'}`}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {selectedCategory === 'Main Courses' && (
                <div className={`mb-6 w-full lg:w-fit self-center rounded-t-sm grid grid-cols-2 md:grid-cols-${mainSubCategories.length}`}>
                    {mainSubCategories.map(subCategory => (
                        <button
                            key={subCategory}
                            className={`p-3 rounded-t-sm text-buttons text-light transform transition-all duration-300 ease-in-out 
                            ${selectedSubCategory === subCategory ? 'bg-white border-b-2 border-lime text-buttons scale-110' : 'border-b-2 border-[transparent]'}`}
                            onClick={() => setSelectedSubCategory(subCategory)}
                        >
                            {subCategory}
                        </button>
                    ))}
                </div>
            )}

            <div className="w-full gap-2 grid grid-cols-1">
                {filteredItems.map((item, index) => (
                    <MenuItem
                        key={index}
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