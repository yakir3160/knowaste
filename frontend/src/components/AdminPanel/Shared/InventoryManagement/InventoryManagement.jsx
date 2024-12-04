import React, { useState } from 'react';
import Menu from "./Menu/Menu";
import AdminPanelContainer from "../../AdminPanelContainer";
import Inventory from "./Inventory";
import { useItemsContext } from "../../../../contexts/ItemsContext";
import { useUserContext } from "../../../../contexts/UserContext";
import Card from "../../../Common/Card/Card";
import Button from "../../../Common/Button/Button";
import { Plus } from "lucide-react";
import AddMenuItem from "./Menu/AddMenuItem";
import TabNavigation from "../../../Common/TabNavigation/TabNavigation";

const TABS = ['Menu', 'Inventory'];

const InventoryManagement = () => {
    const { ingredients ,userItems,categories } = useItemsContext();
    const { userBaseData: user } = useUserContext();
    const [isAdding, setIsAdding] = useState(false);
    const [currentTab, setCurrentTab] = useState(TABS[0]);

    const handleAddClick = () => {
        setIsAdding(true);
    };
    const accountType = user?.accountType;
    const isSupplier = accountType === 'supplier';
    const title = isSupplier ? 'Products' : 'Menu';
    const emptyMessage = isSupplier
        ? 'No products available..'
        : 'Your menu is empty..';
    const addButtonLabel = isSupplier
        ? 'Add Product'
        : 'Add Menu Item';

    const TabComponents = {
        'Menu': () => (
            <Card className={`col-span-full flex justify-center h-fit`}>
                <h3 className="text-titles text-3xl p-3 text-center">{title}</h3>
                <Button
                    className="w-fit p-4 m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                    onClick={handleAddClick}
                >
                    {addButtonLabel}
                    <Plus size={22} />
                </Button>
                {isAdding && (
                    <AddMenuItem
                        onAdd={(newItem) => {
                            console.log(newItem);
                            setIsAdding(false);
                        }}
                        categories={categories}
                    />
                )}
                {userItems?.length > 0 ? (
                    <Menu
                        userItems={userItems}
                        categories={categories}
                        title={title}
                        addButtonLabel={addButtonLabel}
                        handleAddClick={handleAddClick}
                    />
                ) : (
                    <Card className="text-center text-3xl gap-3 flex flex-col justify-center items-center">
                        <p>{emptyMessage}</p>
                        <p>Add some items to your {title.toLowerCase()}</p>
                    </Card>
                )}
            </Card>
        ),
        'Inventory': () => <Inventory userItems={ingredients} categories={categories} />
    };

    const CurrentTabComponent = TabComponents[currentTab] || (() => <div>Tab not found</div>);

    return (
        <AdminPanelContainer
            pageTitle={"Inventory Management"}
            layout={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 rounded-md border-2 p-6'}
        >
            <div className={`col-span-full flex justify-center`}>
                <TabNavigation tabs={TABS} onTabChange={setCurrentTab} />
            </div>
            <CurrentTabComponent />
        </AdminPanelContainer>
    );
};

export default InventoryManagement;
