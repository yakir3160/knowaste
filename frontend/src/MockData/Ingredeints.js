export const ingredients = [
  // PRODUCE
  {
    name: "Red Bell Pepper",
    categoryId: "produce",
    storageType: "Refrigerator",
    pricePerUnit: 12,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Baby Spinach",
    categoryId: "produce",
    storageType: "Refrigerator",
    pricePerUnit: 15,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Mushrooms",
    categoryId: "produce",
    storageType: "Refrigerator",
    pricePerUnit: 20,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },

  // HERBS & SPICES
  {
    name: "Fresh Thyme",
    categoryId: "herbs",
    storageType: "Refrigerator",
    pricePerUnit: 8,
    quantityPerUnit: 0.1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Fresh Rosemary",
    categoryId: "herbs",
    storageType: "Refrigerator",
    pricePerUnit: 8,
    quantityPerUnit: 0.1,
    unit: "kg",
    allergens: []
  },

  // DAIRY
  {
    name: "Mascarpone",
    categoryId: "dairy",
    storageType: "Refrigerator",
    pricePerUnit: 55,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["MILK"]
  },
  {
    name: "Goat Cheese",
    categoryId: "dairy",
    storageType: "Refrigerator",
    pricePerUnit: 90,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["MILK"]
  },

  // PROTEINS
  {
    name: "Duck Breast",
    categoryId: "meat",
    storageType: "Refrigerator",
    pricePerUnit: 160,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Lamb Chops",
    categoryId: "meat",
    storageType: "Refrigerator",
    pricePerUnit: 180,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },

  // SEAFOOD
  {
    name: "Sea Bass",
    categoryId: "fish",
    storageType: "Refrigerator",
    pricePerUnit: 140,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["FISH"]
  },
  {
    name: "Scallops",
    categoryId: "seafood",
    storageType: "Freezer",
    pricePerUnit: 200,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["SHELLFISH"]
  },

  // GRAINS & STARCHES
  {
    name: "Risotto Rice",
    categoryId: "grains",
    storageType: "Dry Storage",
    pricePerUnit: 22,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Sweet Potato",
    categoryId: "produce",
    storageType: "Room Temperature",
    pricePerUnit: 10,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },

  // SAUCES & CONDIMENTS
  {
    name: "Truffle Oil",
    categoryId: "oils",
    storageType: "Room Temperature",
    pricePerUnit: 200,
    quantityPerUnit: 0.25,
    unit: "l",
    allergens: []
  },
  {
    name: "Balsamic Glaze",
    categoryId: "condiments",
    storageType: "Room Temperature",
    pricePerUnit: 45,
    quantityPerUnit: 0.5,
    unit: "l",
    allergens: []
  } ,

  {
    name: "Veal Sweetbreads",
    categoryId: "meat",
    storageType: "Refrigerator",
    pricePerUnit: 220,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Foie Gras",
    categoryId: "meat",
    storageType: "Refrigerator",
    pricePerUnit: 450,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },

  // UNIQUE PRODUCE
  {
    name: "Black Truffles",
    categoryId: "produce",
    storageType: "Refrigerator",
    pricePerUnit: 3000,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Microgreens Mix",
    categoryId: "produce",
    storageType: "Refrigerator",
    pricePerUnit: 120,
    quantityPerUnit: 0.1,
    unit: "kg",
    allergens: []
  },

  // SPECIALTY ITEMS
  {
    name: "Caviar",
    categoryId: "seafood",
    storageType: "Refrigerator",
    pricePerUnit: 2500,
    quantityPerUnit: 0.25,
    unit: "kg",
    allergens: ["FISH"]
  },
  {
    name: "Saffron Threads",
    categoryId: "spices",
    storageType: "Dry Storage",
    pricePerUnit: 8000,
    quantityPerUnit: 0.1,
    unit: "kg",
    allergens: []
  },

  // ARTISANAL CHEESES
  {
    name: "Aged Comté",
    categoryId: "cheese",
    storageType: "Refrigerator",
    pricePerUnit: 180,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["MILK"]
  },
  {
    name: "Blue Stilton",
    categoryId: "cheese",
    storageType: "Refrigerator",
    pricePerUnit: 160,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["MILK"]
  },

  // UNIQUE CONDIMENTS
  {
    name: "Aged Balsamic Vinegar",
    categoryId: "condiments",
    storageType: "Room Temperature",
    pricePerUnit: 200,
    quantityPerUnit: 0.25,
    unit: "l",
    allergens: []
  },
  {
    name: "White Truffle Oil",
    categoryId: "oils",
    storageType: "Room Temperature",
    pricePerUnit: 300,
    quantityPerUnit: 0.25,
    unit: "l",
    allergens: []
  },
  {
    name: "Bluefin Tuna",
    categoryId: "seafood",
    storageType: "Refrigerator",
    pricePerUnit: 800,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["FISH"]
  },
  {
    name: "King Crab Legs",
    categoryId: "seafood",
    storageType: "Freezer",
    pricePerUnit: 450,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["SHELLFISH"]
  },

  // UNIQUE VEGETABLES (Great for creative sides and garnishes)
  {
    name: "Purple Asparagus",
    categoryId: "produce",
    storageType: "Refrigerator",
    pricePerUnit: 60,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Romanesco Broccoli",
    categoryId: "produce",
    storageType: "Refrigerator",
    pricePerUnit: 40,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },

  // SPECIALTY GRAINS (For unique side dishes)
  {
    name: "Black Forbidden Rice",
    categoryId: "grains",
    storageType: "Dry Storage",
    pricePerUnit: 45,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Wild Rice Blend",
    categoryId: "grains",
    storageType: "Dry Storage",
    pricePerUnit: 35,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },

  // GOURMET MUSHROOMS (Perfect for sauces and vegetarian mains)
  {
    name: "Fresh Morel Mushrooms",
    categoryId: "produce",
    storageType: "Refrigerator",
    pricePerUnit: 400,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Chanterelle Mushrooms",
    categoryId: "produce",
    storageType: "Refrigerator",
    pricePerUnit: 200,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },

  // PREMIUM MEATS (For signature main courses)
  {
    name: "Wagyu A5 Beef",
    categoryId: "meat",
    storageType: "Refrigerator",
    pricePerUnit: 1200,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Iberico Pork Belly",
    categoryId: "meat",
    storageType: "Refrigerator",
    pricePerUnit: 280,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },

  // UNIQUE HERBS (For distinctive flavoring)
  {
    name: "Fresh Lemon Verbena",
    categoryId: "herbs",
    storageType: "Refrigerator",
    pricePerUnit: 80,
    quantityPerUnit: 0.1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Bronze Fennel",
    categoryId: "herbs",
    storageType: "Refrigerator",
    pricePerUnit: 60,
    quantityPerUnit: 0.1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Valrhona Dark Chocolate 70%",
    categoryId: "chocolate",
    storageType: "Room Temperature",
    pricePerUnit: 120,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["MILK"]
  },
  {
    name: "White Chocolate Callebaut",
    categoryId: "chocolate",
    storageType: "Room Temperature",
    pricePerUnit: 90,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["MILK"]
  },

  // NUTS & DRIED FRUITS
  {
    name: "Iranian Pistachios",
    categoryId: "nuts",
    storageType: "Dry Storage",
    pricePerUnit: 160,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["TREE_NUTS"]
  },
  {
    name: "Candied Hazelnuts",
    categoryId: "nuts",
    storageType: "Dry Storage",
    pricePerUnit: 140,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["TREE_NUTS"]
  },

  // PREMIUM DAIRY
  {
    name: "Madagascar Vanilla Beans",
    categoryId: "baking",
    storageType: "Dry Storage",
    pricePerUnit: 800,
    quantityPerUnit: 0.1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Mascarpone Premium",
    categoryId: "dairy",
    storageType: "Refrigerator",
    pricePerUnit: 80,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["MILK"]
  },

  // SPECIALTY FLOURS
  {
    name: "Almond Flour",
    categoryId: "baking",
    storageType: "Dry Storage",
    pricePerUnit: 90,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["TREE_NUTS"]
  },
  {
    name: "00 Italian Flour",
    categoryId: "baking",
    storageType: "Dry Storage",
    pricePerUnit: 15,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: ["WHEAT"]
  },

  // UNIQUE SWEETENERS
  {
    name: "Date Honey",
    categoryId: "sweeteners",
    storageType: "Room Temperature",
    pricePerUnit: 60,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Organic Maple Syrup Grade A",
    categoryId: "sweeteners",
    storageType: "Room Temperature",
    pricePerUnit: 120,
    quantityPerUnit: 1,
    unit: "l",
    allergens: []
  },

  // DECORATIVE ELEMENTS
  {
    name: "Gold Leaf 24K",
    categoryId: "decorative",
    storageType: "Room Temperature",
    pricePerUnit: 800,
    quantityPerUnit: 0.01,
    unit: "kg",
    allergens: []
  },
  {
    name: "Edible Flowers Mix",
    categoryId: "decorative",
    storageType: "Refrigerator",
    pricePerUnit: 200,
    quantityPerUnit: 0.1,
    unit: "kg",
    allergens: []
  },

  // FRUIT PUREES
  {
    name: "Passion Fruit Puree",
    categoryId: "fruit",
    storageType: "Freezer",
    pricePerUnit: 45,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
  },
  {
    name: "Raspberry Puree",
    categoryId: "fruit",
    storageType: "Freezer",
    pricePerUnit: 40,
    quantityPerUnit: 1,
    unit: "kg",
    allergens: []
    },
];




