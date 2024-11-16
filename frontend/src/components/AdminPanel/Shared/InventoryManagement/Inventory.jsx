import React, {useEffect, useState} from "react";
import Card from "../../../Common/Card/Card";
import IngredientsList from "./MenuOrProducts/Menu/IngredientsList";


const Inventory = ({ userItems,categories }) => {



    return (
        <Card className="col-span-2 flex flex-col justify-center h-fit p-4 bg-white shadow-md rounded-lg">
            <h3 className="text-titles text-3xl p-3 text-center border-b-2 border-gray-200">Inventory</h3>
            <ul className="w-full mt-4 space-y-2">
                <li className="text-lg p-3 rounded-sm border border-secondary">Item 1: Apples - 50 units</li>
                <li className="text-lg p-3 rounded-sm border border-secondary">Item 2: Bananas - 30 units</li>
                <li className="text-lg p-3 rounded-sm border border-secondary">Item 3: Oranges - 20 units</li>
                <li className="text-lg p-3 rounded-sm border border-secondary">Item 4: Milk - 10 liters</li>
                <li className="text-lg p-3 rounded-sm border border-secondary">Item 5: Bread - 15 loaves</li>
                <li className="text-lg p-3 rounded-sm border border-secondary">Item 6: Eggs - 200 units</li>
                <li className="text-lg p-3 rounded-sm border border-secondary">Item 7: Butter - 5 kg</li>
                <li className="text-lg p-3 rounded-sm border border-secondary">Item 8: Cheese - 10 kg</li>
            </ul>
        </Card>
    );
};

export default Inventory;