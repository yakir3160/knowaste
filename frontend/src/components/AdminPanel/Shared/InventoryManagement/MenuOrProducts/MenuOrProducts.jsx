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
                { id: 1, name: "Product 1", description: "High-quality product", category: "Main Courses", subCategory: "Meat", price: 89, ingredients: ["Beef", "Salt", "Pepper", "Olive Oil,Rosmari"] },
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
                {
                    "id": 1,
                    "name": "Bruschetta",
                    "description": "Grilled bread with fresh tomatoes",
                    "category": "Appetizers",
                    "price": 32,
                    "ingredients": [
                        {
                            "ingredientId": 101,
                            "name": "Italian Bread",
                            "amountInGrams": 50
                        },
                        {
                            "ingredientId": 102,
                            "name": "Chopped Tomatoes",
                            "amountInGrams": 30
                        },
                        {
                            "ingredientId": 103,
                            "name": "Garlic",
                            "amountInGrams": 5
                        },
                        {
                            "ingredientId": 104,
                            "name": "Basil",
                            "amountInGrams": 2
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "Caesar Salad",
                    "description": "Romaine lettuce with classic Caesar dressing",
                    "category": "Appetizers",
                    "price": 45,
                    "ingredients": [
                        {
                            "ingredientId": 201,
                            "name": "Romaine Lettuce",
                            "amountInGrams": 50
                        },
                        {
                            "ingredientId": 202,
                            "name": "Croutons",
                            "amountInGrams": 20
                        },
                        {
                            "ingredientId": 203,
                            "name": "Parmesan",
                            "amountInGrams": 10
                        },
                        {
                            "ingredientId": 204,
                            "name": "Caesar Dressing",
                            "amountInGrams": 15
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "Spaghetti",
                    "description": "Classic Italian pasta with tomato sauce",
                    "category": "Main Courses",
                    "subCategory": "Pasta",
                    "price": 62,
                    "ingredients": [
                        {
                            "ingredientId": 301,
                            "name": "Spaghetti Pasta",
                            "amountInGrams": 100
                        },
                        {
                            "ingredientId": 302,
                            "name": "Tomato Sauce",
                            "amountInGrams": 50
                        },
                        {
                            "ingredientId": 303,
                            "name": "Garlic",
                            "amountInGrams": 5
                        },
                        {
                            "ingredientId": 304,
                            "name": "Olive Oil",
                            "amountInGrams": 10
                        }
                    ]
                },
                {
                    "id": 4,
                    "name": "Steak",
                    "description": "Grilled steak cooked to perfection",
                    "category": "Main Courses",
                    "subCategory": "Meat",
                    "price": 120,
                    "ingredients": [
                        {
                            "ingredientId": 401,
                            "name": "Beef",
                            "amountInGrams": 250
                        },
                        {
                            "ingredientId": 402,
                            "name": "Salt",
                            "amountInGrams": 2
                        },
                        {
                            "ingredientId": 403,
                            "name": "Black Pepper",
                            "amountInGrams": 2
                        },
                        {
                            "ingredientId": 404,
                            "name": "Rosemary",
                            "amountInGrams": 1
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "Cheesecake",
                    "description": "Creamy dessert with a graham cracker crust",
                    "category": "Desserts",
                    "price": 38,
                    "ingredients": [
                        {
                            "ingredientId": 501,
                            "name": "Cream Cheese",
                            "amountInGrams": 100
                        },
                        {
                            "ingredientId": 502,
                            "name": "Sour Cream",
                            "amountInGrams": 50
                        },
                        {
                            "ingredientId": 503,
                            "name": "Eggs",
                            "amountInGrams": 30
                        },
                        {
                            "ingredientId": 504,
                            "name": "Graham Crackers",
                            "amountInGrams": 40
                        }
                    ]
                },
                {
                    "id": 6,
                    "name": "Margherita Pizza",
                    "description": "Classic pizza with mozzarella and basil",
                    "category": "Main Courses",
                    "subCategory": "Pizza",
                    "price": 50,
                    "ingredients": [
                        {
                            "ingredientId": 601,
                            "name": "Pizza Dough",
                            "amountInGrams": 200
                        },
                        {
                            "ingredientId": 602,
                            "name": "Tomato Sauce",
                            "amountInGrams": 50
                        },
                        {
                            "ingredientId": 603,
                            "name": "Mozzarella Cheese",
                            "amountInGrams": 70
                        },
                        {
                            "ingredientId": 604,
                            "name": "Basil Leaves",
                            "amountInGrams": 5
                        }
                    ]
                },
                {
                    "id": 7,
                    "name": "Pancakes",
                    "description": "Fluffy pancakes served with syrup",
                    "category": "Breakfast",
                    "price": 28,
                    "ingredients": [
                        {
                            "ingredientId": 701,
                            "name": "Flour",
                            "amountInGrams": 100
                        },
                        {
                            "ingredientId": 702,
                            "name": "Milk",
                            "amountInGrams": 150
                        },
                        {
                            "ingredientId": 703,
                            "name": "Eggs",
                            "amountInGrams": 50
                        },
                        {
                            "ingredientId": 704,
                            "name": "Butter",
                            "amountInGrams": 10
                        },
                        {
                            "ingredientId": 705,
                            "name": "Maple Syrup",
                            "amountInGrams": 20
                        }
                    ]
                },
                {
                    "id": 8,
                    "name": "Fish Tacos",
                    "description": "Crispy fish tacos with slaw and lime",
                    "category": "Main Courses",
                    "subCategory": "Seafood",
                    "price": 70,
                    "ingredients": [
                        {
                            "ingredientId": 801,
                            "name": "Tortillas",
                            "amountInGrams": 50
                        },
                        {
                            "ingredientId": 802,
                            "name": "Cod Fish",
                            "amountInGrams": 100
                        },
                        {
                            "ingredientId": 803,
                            "name": "Cabbage Slaw",
                            "amountInGrams": 40
                        },
                        {
                            "ingredientId": 804,
                            "name": "Lime",
                            "amountInGrams": 10
                        }
                    ]
                },
                {
                    "id": 9,
                    "name": "Beef Tacos",
                    "description": "Seasoned ground beef tacos with all the toppings",
                    "category": "Main Courses",
                    "subCategory": "Seafood",
                    "price": 65,
                    "ingredients": [
                        {
                            "ingredientId": 901,
                            "name": "Tortillas",
                            "amountInGrams": 60
                        },
                        {
                            "ingredientId": 902,
                            "name": "Ground Beef",
                            "amountInGrams": 150
                        },
                        {
                            "ingredientId": 903,
                            "name": "Lettuce",
                            "amountInGrams": 30
                        },
                        {
                            "ingredientId": 904,
                            "name": "Tomato",
                            "amountInGrams": 20
                        },
                        {
                            "ingredientId": 905,
                            "name": "Onion",
                            "amountInGrams": 10
                        },
                        {
                            "ingredientId": 906,
                            "name": "Sour Cream",
                            "amountInGrams": 15
                        },
                        {
                            "ingredientId": 907,
                            "name": "Shredded Cheese",
                            "amountInGrams": 25
                        }
                    ]
                },
                {
                    "id": 10,
                    "name": "Chicken Parmesan",
                    "description": "Breaded chicken breast topped with marinara and mozzarella",
                    "category": "Main Courses",
                    "subCategory": "Poultry",
                    "price": 85,
                    "ingredients": [
                        {
                            "ingredientId": 1001,
                            "name": "Chicken Breast",
                            "amountInGrams": 200
                        },
                        {
                            "ingredientId": 1002,
                            "name": "Breadcrumbs",
                            "amountInGrams": 30
                        },
                        {
                            "ingredientId": 1003,
                            "name": "Marinara Sauce",
                            "amountInGrams": 50
                        },
                        {
                            "ingredientId": 1004,
                            "name": "Mozzarella Cheese",
                            "amountInGrams": 40
                        },
                        {
                            "ingredientId": 1005,
                            "name": "Olive Oil",
                            "amountInGrams": 10
                        }
                    ]
                },
                {
                    "id": 11,
                    "name": "Grilled Salmon",
                    "description": "Fresh salmon fillet with lemon and dill",
                    "category": "Main Courses",
                    "subCategory": "Seafood",
                    "price": 90,
                    "ingredients": [
                        {
                            "ingredientId": 1101,
                            "name": "Salmon Fillet",
                            "amountInGrams": 180
                        },
                        {
                            "ingredientId": 1102,
                            "name": "Lemon",
                            "amountInGrams": 15
                        },
                        {
                            "ingredientId": 1103,
                            "name": "Dill",
                            "amountInGrams": 5
                        },
                        {
                            "ingredientId": 1104,
                            "name": "Olive Oil",
                            "amountInGrams": 10
                        },
                        {
                            "ingredientId": 1105,
                            "name": "Salt",
                            "amountInGrams": 2
                        },
                        {
                            "ingredientId": 1106,
                            "name": "Black Pepper",
                            "amountInGrams": 1
                        }
                    ]
                },
                {
                    "id": 12,
                    "name": "Chicken Noodle Soup",
                    "description": "Hearty chicken soup with egg noodles",
                    "category": "Soups",
                    "subCategory": "Poultry",
                    "price": 52,
                    "ingredients": [
                        {
                            "ingredientId": 1201,
                            "name": "Chicken Broth",
                            "amountInGrams": 300
                        },
                        {
                            "ingredientId": 1202,
                            "name": "Chicken Thighs",
                            "amountInGrams": 150
                        },
                        {
                            "ingredientId": 1203,
                            "name": "Egg Noodles",
                            "amountInGrams": 60
                        },
                        {
                            "ingredientId": 1204,
                            "name": "Carrots",
                            "amountInGrams": 30
                        },
                        {
                            "ingredientId": 1205,
                            "name": "Celery",
                            "amountInGrams": 20
                        },
                        {
                            "ingredientId": 1206,
                            "name": "Onion",
                            "amountInGrams": 15
                        },
                        {
                            "ingredientId": 1207,
                            "name": "Parsley",
                            "amountInGrams": 5
                        }
                    ]
                },
                {
                    "id": 13,
                    "name": "Beef Stroganoff",
                    "description": "Tender beef in a creamy mushroom sauce over egg noodles",
                    "category": "Main Courses",
                    "subCategory": "Pasta",
                    "price": 78,
                    "ingredients": [
                        {
                            "ingredientId": 1301,
                            "name": "Beef Tenderloin",
                            "amountInGrams": 200
                        },
                        {
                            "ingredientId": 1302,
                            "name": "Egg Noodles",
                            "amountInGrams": 100
                        },
                        {
                            "ingredientId": 1303,
                            "name": "Mushrooms",
                            "amountInGrams": 60
                        },
                        {
                            "ingredientId": 1304,
                            "name": "Sour Cream",
                            "amountInGrams": 50
                        },
                        {
                            "ingredientId": 1305,
                            "name": "Onion",
                            "amountInGrams": 30
                        },
                        {
                            "ingredientId": 1306,
                            "name": "Beef Broth",
                            "amountInGrams": 100
                        },
                        {
                            "ingredientId": 1307,
                            "name": "Butter",
                            "amountInGrams": 15
                        }
                    ]
                },
                {
                    "id": 14,
                    "name": "Vegetable Fried Rice",
                    "description": "Stir-fried rice with mixed vegetables",
                    "category": "Main Courses",
                    "subCategory": "Vegetarian",
                    "price": 55,
                    "ingredients": [
                        {
                            "ingredientId": 1401,
                            "name": "Cooked Rice",
                            "amountInGrams": 150
                        },
                        {
                            "ingredientId": 1402,
                            "name": "Mixed Vegetables",
                            "amountInGrams": 100
                        },
                        {
                            "ingredientId": 1403,
                            "name": "Soy Sauce",
                            "amountInGrams": 10
                        },
                        {
                            "ingredientId": 1404,
                            "name": "Sesame Oil",
                            "amountInGrams": 5
                        },
                        {
                            "ingredientId": 1405,
                            "name": "Eggs",
                            "amountInGrams": 30
                        },
                        {
                            "ingredientId": 1406,
                            "name": "Garlic",
                            "amountInGrams": 10
                        }
                    ]
                },
                {
                    "id": 15,
                    "name": "Spinach and Feta Stuffed Chicken",
                    "description": "Juicy chicken breast stuffed with spinach and feta",
                    "category": "Main Courses",
                    "subCategory": "Poultry",
                    "price": 92,
                    "ingredients": [
                        {
                            "ingredientId": 1501,
                            "name": "Chicken Breast",
                            "amountInGrams": 180
                        },
                        {
                            "ingredientId": 1502,
                            "name": "Spinach",
                            "amountInGrams": 40
                        },
                        {
                            "ingredientId": 1503,
                            "name": "Feta Cheese",
                            "amountInGrams": 30
                        },
                        {
                            "ingredientId": 1504,
                            "name": "Breadcrumbs",
                            "amountInGrams": 20,
                        },
                        {
                            "ingredientId": 1505,
                            "name": "Garlic",
                            "amountInGrams": 5
                        },
                        {
                            "ingredientId": 1506,
                            "name": "Olive Oil",
                            "amountInGrams": 10
                        }
                    ]
                }

            ];
        setItems(fakeItems);
    }, [isSupplier]);

    return (
        <Card className={`col-span-2 flex justify-center h-fit`}>
            <h3 className="text-titles text-3xl p-3 text-center">{title}</h3>
            <Button
                className="w-fit p-4 m-6 border-2 border-lime flex flex-row justify-center items-center font-semibold text-lg"
                onClick={() => console.log(`Add ${isSupplier ? 'product' : 'menu item'}`)}
            >
                {addButtonLabel}
                <Plus size={22} />
            </Button>
            {items.length > 0 ? (
                <Menu items={items} title={title} />
            ) : (
                <Card className="text-center text-3xl gap-3 flex flex-col justify-center items-center">
                    <p>{emptyMessage}</p>
                    <p>Add some items to your {title.toLowerCase()}</p>
                </Card>
            )}
        </Card>
    );
};

export default MenuOrProducts;