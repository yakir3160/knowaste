import React, { useEffect, useState, useCallback } from "react";
import Card from "../../Common/Card/Card";
import Button from "../../Common/Button/Button";
import { Plus } from 'lucide-react';
import { useItemsContext } from "../../../contexts/ItemsContext";

const Inventory = ({ userItems, categories }) => {
    const { ingredients } = useItemsContext();
    const [sortedProducts, setSortedProducts] = useState(ingredients);
    const [sortChoice, setSortChoice] = useState('name');
    console.log('Inventory:', ingredients);

    // פונקציה למיון המוצרים
    const handleSort = useCallback((sortBy) => {
        setSortChoice(sortBy);
        console.log('Sorting by:', sortBy);
        const sortedProducts = [...ingredients].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'quantity':
                    return a.stock - b.stock;
                default:
                    return 0;
            }
        });
        setSortedProducts(sortedProducts);
    }, [ingredients]);

    useEffect(() => {
        handleSort(sortChoice);
    }, [sortChoice, ingredients]);

    // פונקציה לחישוב הכמות הכוללת במונחי יחידות אספקה
    const calculateStockInUnits = (product) => {
        return product.supply?.unitsPerPackage
            ? product.stock * product.supply.unitsPerPackage
            : product.stock;
    };

    // פונקציה להמרת כמות לגרם לק"ג אם יחידת המדידה היא גרם
    const formatStock = (stockInUnits, product) => {
        return product.unit === 'g' && stockInUnits >= 1000
            ? `${(stockInUnits / 1000).toFixed(2)} kg`
            : `${stockInUnits} ${product.unit}`;
    };

    // פונקציה לבדוק אם כמות המלאי מתחת למינימום
    const checkStockLow = (product) => {
        return product.stock < product.minStockLevel;
    };

    return (
        <Card className={`col-span-full`}>
            <h3 className="text-titles text-3xl p-3 text-center">Inventory</h3>
            <div className="flex justify-center items-center">
                <Button
                    className="w-fit p-4 m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                >
                    Add New Order
                    <Plus size={22} />
                </Button>
            </div>
            <ul className="w-full">
                <div className="flex justify-between items-center p-3">
                    <h3 className="text-titles text-2xl">Products</h3>
                    <div className="flex justify-center items-center ">
                        <span className="text-titles text-lg p-2 mb-2">Sort by:</span>
                        <select
                            name={"sortBy"}
                            value={sortChoice}
                            className={`w-fit  p-2 border-2 border-secondary rounded-sm mb-2 focus:outline-none focus:border-lime`}
                            onChange={(e) => setSortChoice(e.target.value)}
                        >
                            <option value="name">Name</option>
                            <option value="quantity">Quantity</option>
                        </select>
                    </div>
                </div>

                <ul className={`space-y-2`}>
                    {sortedProducts?.map((product) => {
                        const stockInUnits = calculateStockInUnits(product);
                        const formattedStock = formatStock(stockInUnits, product);
                        const isStockLow = checkStockLow(product);

                        return (
                            <Card key={product.id} className="bg-white rounded-lg p-5 flex flex-col space-y-3">
                                <div className="flex justify-between items-center">
                                    <strong className="text-titles text-2xl font-semibold">{product.name}</strong>
                                    <span className="text-lg text-secondary">{product.category}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg">Stock: <span className="font-semibold">{formattedStock}</span> ({product.stock} {product.supply?.supplierUnit || 'units'})</span>
                                    <span className="text-lg">Price: <span className="font-semibold">${product.pricePerUnit}</span></span>
                                </div>

                                {/* הצגת הודעה אם המלאי נמוך מהמינימום */}
                                <div className="mt-3">
                                    {isStockLow ? (
                                        <span className="text-errorRed font-semibold animate-pulse">Order Needed</span>
                                    ) : (
                                        <span className="text-green font-semibold">In Stock</span>
                                    )}
                                </div>

                                {/* כפתור נוסף להוספת הזמנה */}
                                <div className="flex justify-end mt-4">
                                    <Button className="bg-lime text-white py-2 px-4 rounded-lg hover:bg-lime-dark transition duration-300">Order Now</Button>
                                </div>
                            </Card>
                        );
                    })}
                </ul>
            </ul>
        </Card>
    );
}

export default Inventory;
