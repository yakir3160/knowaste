import { useState, useEffect } from "react";

const useFilteredItems = (userItems = [], categories = []) => {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || '');
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);
    const subCategories = categories.find(category => category.name === selectedCategory)?.subCategories || [];

    useEffect(() => {
        setSelectedSubCategory(subCategories[0]?.name || null);
    }, [selectedCategory]);

    const filteredItems = userItems
        .filter(category => category.name === selectedCategory) // מסנן קטגוריות לפי שם
        .flatMap(category =>
            category.items ||
            (category.subCategories ? category.subCategories
                    .filter(sub => sub.name === selectedSubCategory)
                    .flatMap(sub => sub.items)
                : [])
        );

    return {
        filteredItems,
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        subCategories
    };
};

export default useFilteredItems;
