import React, {useEffect, useState} from "react";
import Card from "../../../Common/Card/Card";
import Button from "../../../Common/Button/Button";
import {Dot, Plus} from 'lucide-react'


const Inventory = ({ userItems, categories }) => {
    const [products, setProducts] = useState(
        [
                {id:'a1',name: "Yellow Cheddar", quantity: 1, unitType: "kg"},
                {id:'a2',name: "Mozzarella", quantity: 3, unitType: "kg"},
                {id:'a3',name: "Medjool Dates", quantity: 0.2, unitType: "kg"},
                {id:'a4',name: "Pink Lady Apples", quantity: 2, unitType: "kg"},
                {id:'a5',name: "Cavendish Bananas", quantity: 1, unitType: "kg"},
                {id:'a6',name: "Medjool Dates", quantity: 2, unitType: "kg"},
    ]
);
    const handleSort = (sortBy) => {
        const sortedProducts = [...products].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                return a.name.localeCompare(b.name);
                case 'quantity':
                return a.quantity - b.quantity;

            }
            return 0;
        });
        setProducts(sortedProducts);
    };


    return (
        <Card className={`col-span-2 `}>
            <h3 className="text-titles text-3xl p-3 text-center">Inventory</h3>
            <div className="flex justify-center items-center">
            <Button
                className="w-fit p-4 m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
            >
                Add New Order
                <Plus size={22}/>
            </Button>
            </div>
            <ul className="w-full ">
                <select
                    name={"sortBy"}
                    className={`w-1/4 p-2 border-2 border-secondary rounded-sm mb-2 focus:outline-none focus:border-lime`}
                    onChange={(e) => {
                        handleSort(e.target.value);
                        console.log(e.target.value);
                    }}
                >
                    <option value="" disabled selected >Sort by</option>
                    <option value="name">Name</option>
                    <option value="quantity">Quantity</option>
                </select>
                    <ul className={``}>
                        {products?.map((product) => (
                            <Card key={product.id} className={`text-titles text-xl grid grid-cols-3 gap-5`}>
                                <strong className={`p-3`}>{`${product.name}`}</strong>
                                <span >{`${product.quantity} ${product.unitType}`}</span>
                                <div className="flex">
                                    <span className={`${product.quantity > 1 ? 'text-green' : 'text-errorRed animate-pulse'} `}>{
                                        product.quantity > 1
                                            ? 'In Stock'
                                            : 'Order Needed'

                                    }</span>
                                </div>

                            </Card>
                        ))}
                    </ul>
            </ul>
        </Card>
    );
}
export default Inventory;