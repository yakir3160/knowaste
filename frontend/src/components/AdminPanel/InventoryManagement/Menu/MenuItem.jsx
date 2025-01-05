import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CircleX, Pencil } from 'lucide-react';
import Button from '../../../Common/Button/Button';
import Card from "../../../Common/Card/Card";
import { useItemsContext } from "../../../../contexts/ItemsContext";
import ConfirmDelete from "../../../Common/ConfirmDelete/ConfirmDelete";
const MenuItem = ({ item, onEdit }) => {
    const [showIngredients, setShowIngredients] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { deleteMenuItem, itemsError } = useItemsContext();

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = () => {
        deleteMenuItem(item.menuItemId);
        setShowDeleteConfirm(false);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
    };

    return (
        <Card className="rounded-lg h-fit p-3 mb-4 border-2 border-secondary ">
            <button
                type="button"
                onClick={handleDeleteClick}
                className=" text-errorRed "
            >
                <CircleX size={22}/>
            </button>
            <div className="gap-5 grid grid-cols-2 md:grid-cols-4 items-center">
                <h2 className="text-titles text-xl font-semibold">{item.name}</h2>
                <p className="text-lg font-medium text-primary">₪{item.price}</p>

                {itemsError && (
                    <div className="text-errorRed text-sm font-semibold">
                        {itemsError}
                    </div>
                )}

                <Button
                    type="button"
                    onClick={() => setShowIngredients(!showIngredients)}
                    className="text-md flex flex-row w-fit"
                >
                    {showIngredients ? 'Hide Ingredients' : 'Show Ingredients'}
                    {showIngredients ? <ChevronUp size={20} className="mt-0.5"/> :
                        <ChevronDown size={20} className="mt-0.5"/>}
                </Button>

                <div className="space-x-2 flex justify-center">
                    <Button
                        type="button"
                        onClick={() => {
                            onEdit({item})
                            window.scrollTo(0, 0);
                        }}
                        className="w-fit border border-transparent"
                    >
                        <Pencil size={20}/>
                    </Button>

                </div>

                <div className={`overflow-hidden ${showIngredients ? 'max-h-fit' : 'max-h-0'}`}>
                    {showIngredients && (
                        <div className="mt-4 text-titles">
                            <h3 className="font-semibold mb-2">Ingredients:</h3>
                            <ul className="list-none pl-4">
                                {item.ingredients?.map((ingredient, index) => (
                                    <li key={index} className="mb-1">
                                        {index + 1}. {ingredient.name} - {ingredient.quantity} {ingredient.unitType}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            {showDeleteConfirm && (
                <ConfirmDelete
                    isOpen={showDeleteConfirm}
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    name={item.name}
                />
            )}
        </Card>

    );
};

export default MenuItem;
