import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserContext } from "./UserContext";
import MenuItems from "../MockData/MenuItems.json";
import SupplierProducts from "../MockData/SupplierProducts.json";

// יצירת הקונטקסט
const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();

    const [loadingItems, setLoadingItems] = useState(true);
    const [userItems, setUserItems] = useState();
    const [categories, setCategories] = useState();
    const [products, setProducts] = useState(
        [
            {id:'a1',name: "Yellow Cheddar", quantity: 1, unitType: "kg"},
            {id:'a2',name: "Mozzarella", quantity: 3, unitType: "kg"},
            {id:'a3',name: "Medjool Dates", quantity: 0.2, unitType: "kg"},
            {id:'a4',name: "Pink Lady Apples", quantity: 2, unitType: "kg"},
            {id:'a5',name: "Cavendish Bananas", quantity: 1, unitType: "kg"},
            {id:'a6',name: "Medjool Dates", quantity: 2, unitType: "kg"},
        ]
    );

    useEffect(() => {
        setLoadingItems(true);
        setUserItems(
            user?.accountType === 'supplier'
                ? Object.entries(SupplierProducts.suppliers["1"].categories).map(([categoryKey, category]) => ({
                    id: categoryKey,
                    name: categoryKey,
                    products: category.products.map(product => ({
                        id: product.productId,
                        name: product.name,
                        price: product.basePrice,
                        brand: product.brand,
                        unitType: product.unitType,
                        minOrder: product.minOrder,
                        type: product?.type,
                        volume: product?.volume,
                        origin: product?.origin,
                        grade: product?.grade,
                    }))
                }))
                : MenuItems.categories.map(category => ({
                id: category.id,
                category: category.name,
                subCategories:category.subCategories || null,
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
        setLoadingItems(false);
        return () => {
            setUserItems(null);
            setCategories(null);
        };
    }, [user]);

    return (
        <ItemsContext.Provider value={{ userItems, categories ,products, setProducts,loadingItems}}>
            {children}
        </ItemsContext.Provider>
    );
};

// hook לשימוש בקונטקסט
export const useItemsContext = () => useContext(ItemsContext);
