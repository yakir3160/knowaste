import React from 'react';
import MenuOrProducts from "./MenuOrProducts/MenuOrProducts";
import AdminPanelContainer from "../../AdminPanelContainer";
import Inventory from "./Inventory";




const InventoryManagement = () => {
    return (
        <AdminPanelContainer pageTitle={"Inventory Management"} layout={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 rounded-md border-2 p-6'}>
            <MenuOrProducts/>
            <Inventory/>
        </AdminPanelContainer>
        );
};

export default InventoryManagement;
