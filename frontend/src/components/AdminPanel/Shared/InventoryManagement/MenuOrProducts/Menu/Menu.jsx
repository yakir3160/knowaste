import React, { useState } from "react";
import logo from "../../../../../Common/Logo/Logo";
import Button from "../../../../../Common/Button/Button";
import {CircleX,Pencil} from 'lucide-react'

const Menu = ({ items }) => {
    const [selectedCategory ,setSelectedCategory] = useState("Appetizers")
    const [selectedSubCategory ,setSelectedSubCategory] = useState("Meat")

    const categories = ["Appetizers", "Main Courses", "Desserts", "Drinks"]
    const mainCourses = items.filter(item => item.category === "Main Courses")
    const mainSubCategories = Array.from(new Set(mainCourses.map((item => item.subCategory)))).sort()

    console.table(mainCourses)
    console.table(mainSubCategories)
    console.table(categories)
    const filteredItems = selectedCategory === 'Main Courses'
        ?  mainCourses.filter(item => item.subCategory === selectedSubCategory)
        : items.filter(item => item.category === selectedCategory)
    return(
        <div className={`flex flex-col justify-center items-center`}>
            {/* Tabs עבור קטגוריות */}
            <div className={`mb-6 bg-secondary w-full lg:w-fit self-center rounded-t-sm grid grid-cols-2 md:grid-cols-4 `}>
                {categories.map(category => (
                    <button
                        key={category}
                        className={`p-3 rounded-t-sm font-semibold transform transition-all duration-300 border-b-2 border-buttons   
                         ${selectedCategory === category ? 'bg-base border-b-2 border-lime text-buttons' : 'border-b-2 border-[transparent] '} `}
                        onClick={() => setSelectedCategory(category)}
                    >
                        {category}
                    </button>
                ))}

            </div>

            {/* תפריט תתי קטגוריות עבור מנות עיקריות */}
            {selectedCategory === 'Main Courses' && (
                <div
                    className={`mb-6  w-fit  lg:w-fit self-center rounded-t-sm  grid grid-cols-2 md:grid-cols-${mainSubCategories.length} `}>
                    {mainSubCategories.map(subCategory =>
                        <button
                            className={`p-3 rounded-t-sm text-buttons text-light  transform transition-all duration-300 ease-in-out border-b-2 border-buttons 
                            
                            ${selectedSubCategory === subCategory ? 'bg-base border-b-2 border-lime text-buttons' : 'border-b-2 border-[transparent]  '}`}
                            onClick={() => setSelectedSubCategory(subCategory)}
                        >
                            {subCategory}
                        </button>
                    )}

                </div>
            )}

            {/* המנות בכל קטגוריה*/}
            <div className={`w-full gap-3 grid grid-cols-1 lg:grid-cols-3`}>
            {filteredItems.map((item, index) => (
                <div key={index} className="w-full max-w-md rounded-lg p-6 mb-4 border-2 border-secondary hover:border-primary transition-colors shadow-sm hover:shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-titles text-xl font-semibold">{item.name}</h2>
                        <span className="text-lg font-medium text-primary">{item.price}₪</span>
                    </div>
                    <p className="text-gray-600 mt-2 leading-relaxed">{item.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <Button
                            onClick={() => {
                                console.log(`${item.name} Updated`)}}
                            className="flex flex-row justify-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                        >
                            Update
                            <Pencil size={20} className={`ml-2`}/>
                        </Button>
                        <Button
                            onClick={() => {
                                console.log(`${item.name} Deleted`)}}
                            className=" flex flex-row justify-center  px-4 py-2 text-sm font-medium text-errorRed hover: border border-errorRed  rounded-md hover:bg-errorLightRed hover:text-errorRed transition-colors"
                        >
                            Remove
                            <CircleX size={20} className={`ml-2`}/>
                        </Button>
                    </div>
                </div>
            ))}
            </div>


        </div>
    );
};

export default Menu;