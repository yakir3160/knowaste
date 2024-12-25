import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useItemsContext } from '../../../contexts/ItemsContext';
import AdminPanelContainer from '../AdminPanelContainer';
import TabNavigation from '../../Common/TabNavigation/TabNavigation';
import Card from '../../Common/Card/Card';
import Button from '../../Common/Button/Button';
import Menu from './Menu/Menu';
import Inventory from './Inventory';
import AddMenuItem from './Menu/AddMenuItem';

const InventoryManagement = () => {
    const { ingredients, userItems, categories } = useItemsContext();
    const [isAdding, setIsAdding] = useState(false);
    const [activeTab, setActiveTab] = useState('Menu');

    const handleAddItem = (newItem) => {
        console.log(newItem);
        setIsAdding(false);
    };

    const renderContent = () => {
        if (!userItems?.length) {
            return (
                <Card className="text-center text-3xl gap-3 flex flex-col justify-center items-center">
                    <p>Your menu is empty..</p>
                    <p>Add some items to your menu</p>
                </Card>
            );
        }

        return (
            <Menu
                userItems={userItems}
                categories={categories}
                title="Menu"
                addButtonLabel="Add Menu Item"
                handleAddClick={() => setIsAdding(true)}
            />
        );
    };

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

                    <Button
                        className="w-fit p-4 m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                        onClick={() => setIsAdding(true)}
                    >
                        Add Menu Item
                        <Plus size={22} />
                    </Button>

                    {isAdding && (
                        <AddMenuItem
                            onAdd={handleAddItem}
                            categories={categories}
                        />
                    )}

                    {renderContent()}
                </Card>
            )}

            {activeTab === 'Inventory' && (
                <Inventory
                    userItems={ingredients}
                    categories={categories}
                />
            )}
        </AdminPanelContainer>
    );
};

export default InventoryManagement;