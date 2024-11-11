import React, { useEffect, useState } from 'react';
import { Plus } from "lucide-react";
import Card from "../../../../Common/Card/Card";
import Button from "../../../../Common/Button/Button";
import AddMenuItem   from "./Menu/AddMenuItem";
import { useUserContext } from "../../../../../contexts/UserContext";
import Menu from "./Menu/Menu";

const MenuOrProducts = () => {
    const [items, setItems] = useState([]);
    const {userBaseData: user} = useUserContext();
    const [isAdding, setIsAdding] = useState(false);
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

// Populate with fake items on component mount
    useEffect(() => {
        

    }, []);

    return (
        <Card className={`col-span-2 flex justify-center h-fit`}>
            <h3 className="text-titles text-3xl p-3 text-center">{title}</h3>
            <Button
                className="w-fit p-4 m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                onClick={handleAddClick} // Show the AddMenuItem component
            >
                {addButtonLabel}
                <Plus size={22}/>
            </Button>

            {isAdding && (
                <AddMenuItem onAdd={(newItem) => {
                    console.log(newItem);
                    setIsAdding(false);
                }}/>
            )}

            {items.length > 0 ? (
                <Menu items={items} title={title}/>
            ) : (
                <Card className="text-center text-3xl gap-3 flex flex-col justify-center items-center">
                    <p>{emptyMessage}</p>
                    <p>Add some items to your {title.toLowerCase()}</p>
                </Card>
            )}
        </Card>
    );
}

export default MenuOrProducts;