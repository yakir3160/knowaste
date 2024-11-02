import React, { useEffect, useState } from 'react';
import { Plus } from "lucide-react";
import Card from "../../../../Common/Card/Card";
import Button from "../../../../Common/Button/Button";
import { useUserContext } from "../../../../../contexts/UserContext";
import Menu from "./Menu/Menu";

const MenuOrProducts = () => {
    const [items, setItems] = useState([]);
    const { userBaseData: user } = useUserContext();
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
        const fakeItems = isSupplier
            ? [
                { id: 1, name: "Product 1", description: "High-quality product", category: "Main Courses", subCategory: "Meat", price: 89 },
                { id: 2, name: "Product 2", description: "Affordable product", category: "Drinks", price: 15 },
                { id: 3, name: "Product 3", description: "Eco-friendly product", category: "Appetizers", price: 35 },
                { id: 4, name: "Product 4", description: "Organic vegetables", category: "Main Courses", subCategory: "Vegetarian", price: 65 },
                { id: 5, name: "Product 5", description: "Gluten-free bread", category: "Appetizers", price: 28 },
                { id: 6, name: "Product 6", description: "Artisan cheese", category: "Main Courses", subCategory: "Dairy", price: 75 },
                { id: 7, name: "Product 7", description: "Handmade pasta", category: "Main Courses", subCategory: "Pasta", price: 68 },
                { id: 8, name: "Product 8", description: "Fresh herbs", category: "Appetizers", price: 12 },
                { id: 9, name: "Product 9", description: "Imported wine", category: "Drinks", price: 120 },
                { id: 10, name: "Product 10", description: "Craft beer", category: "Drinks", price: 32 },
            ]
            : [
                { id: 1, name: "Bruschetta", description: "Grilled bread with tomatoes", category: "Appetizers", price: 32 },
                { id: 2, name: "Caesar Salad", description: "Crisp romaine with Caesar dressing", category: "Appetizers", price: 45 },
                { id: 3, name: "Spaghetti", description: "Classic Italian pasta", category: "Main Courses", subCategory: "Pasta", price: 62 },
                { id: 4, name: "Steak", description: "Grilled to perfection", category: "Main Courses", subCategory: "Meat", price: 120 },
                { id: 5, name: "Cheesecake", description: "Creamy dessert with a graham cracker crust", category: "Desserts", price: 38 },
                { id: 6, name: "Chocolate Mousse", description: "Rich and fluffy chocolate dessert", category: "Desserts", price: 35 },
                { id: 7, name: "Lemonade", description: "Freshly squeezed lemonade", category: "Drinks", price: 15 },
                { id: 8, name: "Coffee", description: "Brewed fresh", category: "Drinks", price: 12 },
                { id: 9, name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", category: "Desserts", price: 42 },
                { id: 10, name: "Pasta Primavera", description: "Pasta with fresh vegetables", category: "Main Courses", subCategory: "Vegetarian", price: 58 },
                { id: 11, name: "Garlic Bread", description: "Toasted bread with garlic and herbs", category: "Appetizers", price: 22 },
                { id: 12, name: "Minestrone Soup", description: "Hearty vegetable soup", category: "Main Courses", subCategory: "Soups", price: 42 },
                { id: 13, name: "Fruit Salad", description: "Mixed seasonal fruits", category: "Desserts", price: 32 },
                { id: 14, name: "Iced Tea", description: "Refreshing brewed tea", category: "Drinks", price: 13 },
            ];

        setItems(fakeItems);
    }, [isSupplier]);

    return (
        <Card className="col-span-full">
            <h3 className="text-titles text-3xl p-3 text-center">{title}</h3>
            {items.length > 0 ? (
                <Menu items={items} title={title} />
            ) : (
                <Card className="text-center text-3xl gap-3 flex flex-col justify-center items-center">
                    <p>{emptyMessage}</p>
                    <p>Add some items to your {title.toLowerCase()}</p>
                    <Button
                        className="w-fit p-4 m-4 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                        onClick={() => console.log(`Add ${isSupplier ? 'product' : 'menu item'}`)}
                    >
                        {addButtonLabel}
                        <Plus size={22} />
                    </Button>
                </Card>
            )}
        </Card>
    );
};

export default MenuOrProducts;