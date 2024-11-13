import React, { createContext, useContext } from 'react';
import { useUserItems } from '../Hooks/User/useUserItems';

const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
    const {userItems,categories} = useUserItems();

    return (
        <ItemsContext.Provider value={{userItems,categories}}>
            {children}
        </ItemsContext.Provider>
    );
};

export const useItemsContext = () => useContext(ItemsContext);