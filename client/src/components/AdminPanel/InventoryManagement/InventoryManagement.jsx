import React, {useEffect, useState} from 'react';
import { useItemsContext } from '../../../context/ItemsContext';
import AdminPanelContainer from '../AdminPanelContainer';
import TabNavigation from '../../Common/TabNavigation/TabNavigation';
import Card from '../../Common/Card/Card';
import Menu from './Menu/Menu';
import Inventory from './Inventory/Inventory';

const InventoryManagement = () => {
    const { inventoryItems ,menuItems,success,menuLoading, inventoryLoading,} = useItemsContext();
    const [activeTab, setActiveTab] = useState(  'Menu');
    return (
        <AdminPanelContainer
            pageTitle="Inventory Management"
            layout="border-2 p-2 flex flex-col"
        >
            <TabNavigation
                tabs={['Menu', 'Inventory']}
                onTabChange={setActiveTab}
            />

            {activeTab === 'Menu' && (
                <Card className="col-span-full flex justify-center h-fit">
                    <h3 className="text-titles text-3xl p-3 text-center">Menu</h3>
                    <Menu isEmpty={!menuItems?.length}/>
                </Card>
            )}

            {activeTab === 'Inventory' && (
                <Card className="col-span-full flex justify-center h-fit">
                    <h3 className="text-titles text-3xl p-3 text-center">Inventory</h3>
                    <Inventory isEmpty={!inventoryItems?.length} />
                </Card>
            )}


        </AdminPanelContainer>
    );
};

export default InventoryManagement;
