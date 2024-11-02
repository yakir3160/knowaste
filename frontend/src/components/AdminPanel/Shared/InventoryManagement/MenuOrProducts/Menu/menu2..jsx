import React, { useState } from "react";

const Menu = ({ items }) => {
    const [selectedCategory, setSelectedCategory] = useState("Appetizers");
    const [selectedSubCategory, setSelectedSubCategory] = useState("Meat");

    // קבלת כל תתי הקטגוריות עבור מנות עיקריות
    const mainCourses = items.filter(item => item.category === "Main Courses");
    const subCategories = Array.from(new Set(mainCourses.map(item => item.subCategory)));

    // סינון המנות לפי קטגוריה ותת קטגוריה
    const filteredItems = selectedCategory === "Main Courses"
        ? mainCourses.filter(item => item.subCategory === selectedSubCategory)
        : items.filter(item => item.category === selectedCategory);

    return (
        <div className="flex flex-col justify-center items-center">
            {/* Tabs עבור קטגוריות */}
            <div
                className={`mb-6 bg-secondary w-full lg:w-fit self-center rounded-sm grid grid-cols-2 md:grid-cols-4 `}>
                {["Appetizers", "Main Courses", "Desserts", "Drinks"].map(category => (
                    <button
                        key={category}
                        className={`p-4 rounded-sm  font-semibold hover:shadow-none  ${
                            selectedCategory === category ? "bg-base " : ""
                        }`}
                        onClick={() => {
                            setSelectedCategory(category);
                            if (category !== "Main Courses") {
                                setSelectedSubCategory("Meat");
                            }
                        }}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* תפריט תתי קטגוריות עבור מנות עיקריות */}
            {selectedCategory === "Main Courses" && (
                <div className={`mb-6  w-fit bg-secondary lg:w-fit self-center rounded-sm  grid grid-cols-${subCategories.length}`}>
                    {subCategories.map(subCategory => (
                        <button
                            key={subCategory}
                            className={`rounded-sm  p-3 text-buttons  hover:shadow-none ${
                                selectedSubCategory === subCategory ? "bg-base" : ""
                            }`}
                            onClick={() => setSelectedSubCategory(subCategory)}
                        >
                            {subCategory}
                        </button>
                    ))}
                </div>
            )}
            {/* המנות בכל קטגוריה*/}
            {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredItems.map((item, index) => (
                        <div key={index} className="p-2 border border-gray-200 rounded">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-xl">No items available in this category.</p>
            )}
        </div>
    );
};

export default Menu;