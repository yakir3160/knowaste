import { useState, useContext } from 'react';
import {useItemsContext} from "../../context/ItemsContext";


export const useUserItems = () => {
    const { userItems, categories, } = useItemsContext();

    // פעולות ניהול פריטים
    const handleUpdate = (updatedItem) => {
        // עדכון פריט
        console.log(`${updatedItem.name} Updated`);
    };

    const handleRemove = (itemToRemove) => {
        // מחיקת פריט
        console.log(`${itemToRemove.name} Deleted`);
    };

    const handleAdd = (newItem) => {
        // הוספת פריט חדש
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
