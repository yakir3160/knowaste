import React, {useEffect, useState,useCallback} from "react";
import Card from "../../../Common/Card/Card";
import Button from "../../../Common/Button/Button";
import  {Plus} from 'lucide-react'
import {useItemsContext} from "../../../../contexts/ItemsContext";


const Inventory = ({ userItems, categories  }) => {
    const  {products, setProducts} = useItemsContext();
    const [sortChoice, setSortChoice] = useState('name');

    const handleSort = useCallback((sortBy) => {
        const sortedProducts = [...products].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    setSortChoice(sortBy);
                    return a.name.localeCompare(b.name);
                case 'quantity':
                    setSortChoice(sortBy);
                    return a.quantity - b.quantity;
                default:
                    return sortChoice;
            }
        });
        setProducts(sortedProducts);
    }, [products]);

    useEffect(() => {
        const savedSortChoice = localStorage.getItem('sortChoice');
        console.log(savedSortChoice);
        if (savedSortChoice) {
            setSortChoice(savedSortChoice);
            handleSort(savedSortChoice);
        }
    },  []);
    useEffect(() => {
        localStorage.setItem('sortChoice', sortChoice);
    }, [sortChoice]);

    return (
        <Card className={`col-span-full `}>
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
                <div className="flex justify-between items-center p-3">
                    <h3 className="text-titles text-2xl">Products</h3>

                    <div className="flex justify-center items-center ">
                        <span className="text-titles text-lg p-2 mb-2">Sort by:</span>
                        <select
                            name={"sortBy"}
                            className={`w-fit  p-2 border-2 border-secondary rounded-sm mb-2 focus:outline-none focus:border-lime`}
                            onChange={(e) => {
                                handleSort(e.target.value);
                                console.log(e.target.value);
                            }}
                        >
                            <option value="name">Name</option>
                            <option value="quantity">Quantity</option>
                        </select>
                    </div>

                </div>

                <ul className={``}>
                    {products?.map((product) => (
                        <Card key={product.id} className={`text-titles text-xl grid grid-cols-3 gap-5`}>
                            <strong className={`p-3`}>{`${product.name}`}</strong>
                            <span>{`${product.quantity} ${product.unitType}`}</span>
                            <div className="flex">
                                    <span
                                        className={`${product.quantity > 1 ? 'text-green' : 'text-errorRed animate-pulse'} `}>{
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