import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserContext } from "./UserContext";
import MenuCategories from "../MockData/MenuCategories.json";
import MenuItems from "../MockData/MenuItems.json";
import SupplierCategories from "../MockData/SupplierCategories.json";
import SupplierProducts from "../MockData/SupplierProducts.json";

// יצירת הקונטקסט
const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();

    // יצירת ה-state עבור פריטים וקטגוריות
    const [userItems, setUserItems] = useState();
    const [categories, setCategories] = useState();

    useEffect(() => {
        setUserItems(
            user?.accountType === 'supplier'
                ? user?.products
                : MenuItems.categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    dishes: category.subCategories
                        ? category.subCategories.map(sub => ({
                            subCategoryId: sub.id,
                            subCategoryName: sub.name,
                            items: sub.items
                        }))
                        :
                        category.items

            })) || []
        );

        setCategories(
            user?.accountType === 'supplier'
                ? SupplierProducts
                : MenuItems.categories
                    .map(category => ({
                        name: category.name,
                        subCategories: category.subCategories?.map(sub => sub.name) || []

                    }) || [])


        );

        console.log('User Items Set');
        console.log('user items', userItems)
        console.log('user categories',categories)
    }, [user]);

    return (
        <ItemsContext.Provider value={{ userItems, categories ,}}>
            {children}
        </ItemsContext.Provider>
    );
};

// hook לשימוש בקונטקסט
export const useItemsContext = () => useContext(ItemsContext);
