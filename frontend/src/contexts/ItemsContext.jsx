import React, {createContext, useContext, useEffect, useState} from 'react';
import {useUserContext} from "./UserContext";
import MenuItems from "../MockData/MenuItems.json";
import Ingredients  from "../MockData/Ingredeints.json";
import SupplierProducts from "../MockData/SupplierProducts.json";
import IngredientCategories from '../MockData/ingredientCategories.json';

// יצירת הקונטקסט
const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
    const { userBaseData: user } = useUserContext();

    const [loadingItems, setLoadingItems] = useState(true);
    const [userItems, setUserItems] = useState();
    const [categories, setCategories] = useState();
    const [ingredients, setIngredients] = useState();
    const ingredientCategories = IngredientCategories.categories.map(category => category);
    const ingredientStorageTypes = IngredientCategories.storageTypes.map(storageType => storageType);
    const measurementUnits = IngredientCategories.measurementUnits.map(unit => unit);



    useEffect(() => {
        setLoadingItems(true);
        setUserItems(
            user?.accountType === 'supplier'
                ? SupplierProducts
                : MenuItems.categories
        );
        setCategories(
            user?.accountType === 'supplier'
                ? SupplierProducts
                : MenuItems.categories
                    .map(category => ({
                        name: category.name,
                        subCategories: category.subCategories?.map(sub => ({
                        id: sub.id,
                        name: sub.name
                    })) || []
                })) || []
        );
        setIngredients(
            user?.accountType === 'supplier'
                ? []
                : Ingredients.ingredients.flatMap(ingredient => ingredient)
        )

        console.log('User Items ',userItems);
        console.log('user categories',categories)
        console.log('user ingredients',ingredients)
        setLoadingItems(false);
        return () => {
            setUserItems(null);
            setCategories(null);
        };
    }, [user]);

    return (
        <ItemsContext.Provider value={{ userItems, categories ,loadingItems,ingredients,setIngredients,ingredientCategories,ingredientStorageTypes,measurementUnits}}>
            {children}
        </ItemsContext.Provider>
    );
};

// hook לשימוש בקונטקסט
export const useItemsContext = () => useContext(ItemsContext);
