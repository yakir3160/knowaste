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
                { id: 1, name: "Product 1", description: "High-quality product", category: "Main Courses", subCategory: "Meat", price: 89, ingredients: ["Beef", "Salt", "Pepper", "Olive Oil"] },
                { id: 2, name: "Product 2", description: "Affordable product", category: "Drinks", price: 15, ingredients: ["Water", "Sugar", "Fruit Flavor Extract", "Ice"] },
                { id: 3, name: "Product 3", description: "Eco-friendly product", category: "Appetizers", price: 35, ingredients: ["Organic Lettuce", "Cherry Tomatoes", "Cucumber", "Vinaigrette"] },
                { id: 4, name: "Product 4", description: "Organic fresh vegetables", category: "Main Courses", subCategory: "Vegetarian", price: 65, ingredients: ["Zucchini", "Eggplant", "Bell Peppers", "Olives"] },
                { id: 5, name: "Product 5", description: "Gluten-free bread", category: "Appetizers", price: 28, ingredients: ["Rice Flour", "Water", "Yeast", "Olive Oil"] },
                { id: 6, name: "Product 6", description: "Artisan cheese", category: "Main Courses", subCategory: "Dairy", price: 75, ingredients: ["Cow's Milk", "Cultures", "Salt"] },
                { id: 7, name: "Product 7", description: "Handmade pasta", category: "Main Courses", subCategory: "Pasta", price: 68, ingredients: ["Durum Wheat Flour", "Water", "Eggs"] },
                { id: 8, name: "Product 8", description: "Fresh herbs", category: "Appetizers", price: 12, ingredients: ["Basil", "Parsley", "Mint"] },
                { id: 9, name: "Product 9", description: "Imported high-quality wine", category: "Drinks", price: 120, ingredients: ["Grapes", "Yeast", "Sugar"] },
                { id: 10, name: "Product 10", description: "Locally crafted beer", category: "Drinks", price: 32, ingredients: ["Malt", "Hops", "Water", "Yeast"] },
                { id: 11, name: "Product 11", description: "Premium olive oil", category: "Condiments", price: 45, ingredients: ["Extra Virgin Olive Oil"] },
                { id: 12, name: "Product 12", description: "Aged balsamic vinegar", category: "Condiments", price: 38, ingredients: ["Balsamic Vinegar"] },
                { id: 13, name: "Product 13", description: "Fresh seafood mix", category: "Main Courses", subCategory: "Seafood", price: 95, ingredients: ["Shrimp", "Mussels", "Squid", "Fish"] },
                { id: 14, name: "Product 14", description: "Organic honey", category: "Condiments", price: 25, ingredients: ["Pure Honey"] },
                { id: 15, name: "Product 15", description: "Specialty coffee beans", category: "Drinks", price: 42, ingredients: ["Arabica Coffee Beans"] },
                { id: 16, name: "Product 16", description: "Artisanal chocolates", category: "Desserts", price: 55, ingredients: ["Cocoa", "Sugar", "Cocoa Butter"] },
                { id: 17, name: "Product 17", description: "Gourmet spice blend", category: "Condiments", price: 28, ingredients: ["Mixed Spices", "Herbs"] },
                { id: 18, name: "Product 18", description: "Premium rice", category: "Main Courses", subCategory: "Grains", price: 32, ingredients: ["Basmati Rice"] },
                { id: 19, name: "Product 19", description: "Fresh mushroom mix", category: "Main Courses", subCategory: "Vegetarian", price: 48, ingredients: ["Portobello", "Shiitake", "Button Mushrooms"] },
                { id: 20, name: "Product 20", description: "Specialty tea blend", category: "Drinks", price: 36, ingredients: ["Green Tea", "Herbs", "Dried Fruits"] }
            ]
            : [
                { id: 1, name: "Bruschetta", description: "Grilled bread with fresh tomatoes", category: "Appetizers", price: 32, ingredients: ["Italian Bread", "Chopped Tomatoes", "Garlic", "Basil"] },
                { id: 2, name: "Caesar Salad", description: "Romaine lettuce with classic Caesar dressing", category: "Appetizers", price: 45, ingredients: ["Romaine Lettuce", "Croutons", "Parmesan", "Caesar Dressing"] },
                { id: 3, name: "Spaghetti", description: "Classic Italian pasta with tomato sauce", category: "Main Courses", subCategory: "Pasta", price: 62, ingredients: ["Spaghetti Pasta", "Tomato Sauce", "Garlic", "Olive Oil"] },
                { id: 4, name: "Steak", description: "Grilled steak cooked to perfection", category: "Main Courses", subCategory: "Meat", price: 120, ingredients: ["Beef", "Salt", "Black Pepper", "Rosemary"] },
                { id: 5, name: "Cheesecake", description: "Creamy dessert with a graham cracker crust", category: "Desserts", price: 38, ingredients: ["Cream Cheese", "Sour Cream", "Eggs", "Graham Crackers"] },
                { id: 6, name: "Chocolate Mousse", description: "Rich and fluffy chocolate dessert", category: "Desserts", price: 35, ingredients: ["Dark Chocolate", "Heavy Cream", "Eggs", "Sugar"] },
                { id: 7, name: "Lemonade", description: "Freshly squeezed lemonade", category: "Drinks", price: 15, ingredients: ["Lemon", "Water", "Sugar"] },
                { id: 8, name: "Coffee", description: "Brewed fresh coffee", category: "Drinks", price: 12, ingredients: ["Coffee Beans", "Water"] },
                { id: 9, name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", category: "Desserts", price: 42, ingredients: ["Mascarpone", "Coffee", "Ladyfingers", "Cocoa Powder"] },
                { id: 10, name: "Pasta Primavera", description: "Pasta with fresh vegetables", category: "Main Courses", subCategory: "Vegetarian", price: 58, ingredients: ["Pasta", "Bell Peppers", "Zucchini", "Olive Oil"] },
                { id: 11, name: "Garlic Bread", description: "Toasted bread with garlic and herbs", category: "Appetizers", price: 22, ingredients: ["Bread", "Garlic", "Butter", "Parsley"] },
                { id: 12, name: "Minestrone Soup", description: "Hearty vegetable soup", category: "Main Courses", subCategory: "Soups", price: 42, ingredients: ["Tomatoes", "Carrots", "Celery", "Beans"] },
                { id: 13, name: "Fruit Salad", description: "Mixed seasonal fruits", category: "Desserts", price: 32, ingredients: ["Seasonal Fruits", "Mint", "Lemon Juice"] },
                { id: 14, name: "Iced Tea", description: "Refreshing brewed tea", category: "Drinks", price: 13, ingredients: ["Tea", "Ice", "Lemon", "Sugar"] },
                { id: 15, name: "Grilled Salmon", description: "Fresh salmon fillet with herbs", category: "Main Courses", subCategory: "Seafood", price: 95, ingredients: ["Salmon", "Lemon", "Dill", "Butter"] },
                { id: 16, name: "Mushroom Risotto", description: "Creamy Italian rice with mushrooms", category: "Main Courses", subCategory: "Vegetarian", price: 68, ingredients: ["Arborio Rice", "Mushrooms", "Parmesan", "White Wine"] },
                { id: 17, name: "Greek Salad", description: "Fresh Mediterranean salad", category: "Appetizers", price: 48, ingredients: ["Tomatoes", "Cucumber", "Feta", "Olives"] },
                { id: 18, name: "Espresso Martini", description: "Coffee-based cocktail", category: "Drinks", price: 42, ingredients: ["Vodka", "Coffee Liqueur", "Espresso"] },
                { id: 19, name: "Apple Pie", description: "Homemade classic dessert", category: "Desserts", price: 36, ingredients: ["Apples", "Cinnamon", "Butter", "Flour"] },
                { id: 20, name: "Caprese Salad", description: "Fresh mozzarella and tomatoes", category: "Appetizers", price: 52, ingredients: ["Mozzarella", "Tomatoes", "Basil", "Balsamic"] },
                { id: 21, name: "Beef Lasagna", description: "Layered pasta with meat sauce", category: "Main Courses", subCategory: "Pasta", price: 72, ingredients: ["Pasta Sheets", "Ground Beef", "Tomato Sauce", "Cheese"] },
                { id: 22, name: "Mojito", description: "Classic Cuban cocktail", category: "Drinks", price: 38, ingredients: ["Rum", "Mint", "Lime", "Soda"] },
                { id: 23, name: "Crème Brûlée", description: "Classic French dessert", category: "Desserts", price: 45, ingredients: ["Cream", "Vanilla", "Sugar", "Eggs"] },
                { id: 24, name: "Seafood Paella", description: "Spanish rice dish with seafood", category: "Main Courses", subCategory: "Seafood", price: 110, ingredients: ["Rice", "Mixed Seafood", "Saffron", "bell pepper","anshovis"] },
                { id: 25, name: "Hot Chocolate", description: "Rich chocolate drink", category: "Drinks", price: 18, ingredients: ["Chocolate", "Milk", "Whipped Cream"] }
            ];

        setItems(fakeItems);
    }, [isSupplier]);

    return (
        <Card className={`col-span-2`}>
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