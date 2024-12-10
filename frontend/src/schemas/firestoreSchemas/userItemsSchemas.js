// Collection: users/{uid}/ingredients/{ingredientId}
const ingredientDoc = {
    id: 'number', // Unique ID for the ingredient
    name: 'string', // Name of the ingredient
    category: 'string', // Category (e.g., vegetables, meat)
    storageType: 'string', // Storage type (e.g., refrigerated, frozen)
    unit: 'string', // Unit of measurement (e.g., kg, unit)
    stock: 'number', // Current stock (renamed from currentStock)
    pricePerUnit: 'number', // Price per unit
    minStockLevel: 'number', // Minimum stock level for alerts
    allergens: ['string'], // List of potential allergens
    supply: {
        packageType: 'string', // Type of package
        unitsPerPackage: 'number', // Units per package
        minimumOrderQuantity: 'number', // Minimum order quantity
        supplierUnit: 'string', // Supplier unit
        deliveryDays: ['string'], // Delivery days
        preparationMethod: 'string', // Preparation method
        shelfLife: {
            duration: 'number', // Duration of shelf life
            unit: 'string' // Unit for shelf life duration
        }
    },
    lastUpdated: 'timestamp' // Last update timestamp
};

// Collection: users/{uid}/menu/{menuId}
const menuDoc = {
    categories: [{
        id: 'string', // Category ID
        name: 'string', // Category name
        items: [{
            id: 'number', // Unique item ID (changed to number)
            name: 'string', // Item name
            price: 'number', // Price
            availability: 'string', // Availability status
            ingredients: [{
                ingredientId: 'number', // Ingredient ID (changed to number)
                quantity: 'number' // Quantity required (renamed from amount)
            }]
        }],
        subCategories: [{
            id: 'string', // Subcategory ID
            name: 'string', // Subcategory name
            items: [{
                id: 'number', // Unique item ID (changed to number)
                name: 'string', // Item name
                price: 'number', // Price
                availability: 'string', // Availability status
                ingredients: [{
                    ingredientId: 'number', // Ingredient ID (changed to number)
                    quantity: 'number' // Quantity required (renamed from amount)
                }]
            }]
        }]
    }],
    lastUpdated: 'timestamp', // Last update timestamp
    version: 'number' // Menu version
};
