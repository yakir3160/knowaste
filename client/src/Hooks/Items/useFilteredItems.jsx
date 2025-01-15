import { useState, useEffect } from "react";

const useFilteredItems = (userItems = [], categories = []) => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || categories[0] || '');

    const filteredItems = userItems
        .filter(item => item.categoryName === selectedCategory) // מסנן קטגוריות לפי שם

    return {
        filteredItems,
        selectedCategory,
        setSelectedCategory,
    };
};

export default useFilteredItems;
