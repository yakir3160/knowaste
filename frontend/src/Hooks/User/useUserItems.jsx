import {useState, useMemo, useEffect} from 'react';
import MenuCategories from "../../MockData/MenuCategories.json";
import MenuItems from "../../MockData/MenuItems.json";
import SupplierCategories from "../../MockData/SupplierCategories.json";
import SupplierProducts from "../../MockData/SupplierProducts.json";
import { useUserContext } from "../../contexts/UserContext";
import {useAuthContext} from "../../contexts/AuthContext";

export const useUserItems = () => {
    const { userBaseData: user } = useUserContext();
    const [userItems, setUserItems] = useState();
    const [categories, setCategories] = useState();

    useEffect(() => {
        setUserItems(user?.accountType === 'supplier' ? SupplierProducts.products : MenuItems.MenuItems);
        setCategories(user?.accountType === 'supplier' ? SupplierCategories : MenuCategories);
        console.log('User Items Set');
    }, [userItems,user]);

    // פעולות ניהול פריטים
    const handleUpdate = (updatedItem) => {
        setUserItems(prevItems =>
            prevItems.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        );
        console.log(`${updatedItem.name} Updated`);
    };

    const handleRemove = (itemToRemove) => {
        setUserItems(prevItems =>
            prevItems.filter(item => item.id !== itemToRemove.id)
        );
        console.log(`${itemToRemove.name} Deleted`);
    };

    const handleAdd = (newItem) => {
        setUserItems(prevItems => [...prevItems, { ...newItem, id: Date.now() }]);
        console.log(`${newItem.name} Added`);
    };

    return {
        userItems,
        categories,
        handleUpdate,
        handleRemove,
        handleAdd
    };
};