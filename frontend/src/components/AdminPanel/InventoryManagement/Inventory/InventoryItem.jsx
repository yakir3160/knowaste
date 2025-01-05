import React, { useState } from 'react';
import Card from "../../../Common/Card/Card";
import Button from "../../../Common/Button/Button";
import { Pencil, CircleX, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmDelete from "../../../Common/ConfirmDelete/ConfirmDelete";
import InventoryOrderForm from "./InventoryOrderForm";

const InventoryItem = ({product, onEdit, deleteInventoryItem}) => {
    const [showDelete, setShowDelete] = useState(false);
    const [fromOrder, setFromOrder] = useState(false);

    const handleDeleteClick = () => {
        setShowDelete(true);
    };

    const confirmDelete = () => {
        deleteInventoryItem(product.ingredientId);
        setShowDelete(false);
    };

    return (
        <Card className="rounded-lg h-fit p-3 mb-4 border-2 border-secondary space-y-4" >
            <button
                type="button"
                onClick={handleDeleteClick}
                className="text-errorRed"
            >
                <CircleX size={22}/>
            </button>
            <div className="gap-5 grid grid-cols-2 md:grid-cols-4 items-center">
                <h2 className="text-titles text-xl font-semibold">{product.name}</h2>
                <p className="text-lg font-medium text-primary">₪{product.pricePerUnit}</p>
                <div className="text-lg font-medium text-primary">
                    Stock: <span className="font-semibold">{product.currentStock}</span> ({product.unit})
                </div>


                <div className="space-x-2 flex justify-center">
                    <Button
                        type="button"
                        onClick={() => {
                            onEdit(product);
                            window.scrollTo(0, 0);
                        }}
                        className="w-fit border border-transparent"
                    >
                        <Pencil size={20}/>
                    </Button>
                    <Button
                        type="button"
                        onClick={() => setFromOrder(true)}
                        className="w-fit border-2 border-lime"
                    >
                        Add Stock
                    </Button>
                </div>

            </div>

            <ConfirmDelete
                isOpen={showDelete}
                onClose={() => setShowDelete(false)}
                onConfirm={confirmDelete}
                name={product.name}
            />

            {fromOrder && (
                <InventoryOrderForm
                    onCancel={() => setFromOrder(false)}
                    ingredient={product}
                />
            )}
        </Card>
    );
};

export default InventoryItem;