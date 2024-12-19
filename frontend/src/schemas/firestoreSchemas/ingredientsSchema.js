// Structure for ingredients
const ingredients = [
  {
    id: 1, // Unique ID for the ingredient (number)
    name: 'string', // Name of the ingredient (string)
    category: 'string', // Category of the ingredient (e.g., "vegetables", "meat")
    storageType: 'string', // Type of storage (e.g., "refrigerated", "frozen")
    unit: 'string', // Unit of measurement (e.g., "kg", "unit")
    stock: 100, // Current stock in inventory (number)
    pricePerUnit: 5.99, // Price per unit of the ingredient (number)
    minStockLevel: 10, // Minimum stock level for restocking alerts (number)
    allergens: ['string'], // List of potential allergens (array of strings)
    supply: {
      packageType: 'string', // Type of package (e.g., "box", "bag")
      unitsPerPackage: 10, // Number of units per package (number)
      minimumOrderQuantity: 5, // Minimum order quantity (number)
      supplierUnit: 'string', // Supplier unit (e.g., "kg", "box")
      deliveryDays: ['string'], // Days when deliveries are made (array of strings)
      preparationMethod: 'string', // Preparation method (e.g., "chopped", "whole")
      shelfLife: {
        duration: 30, // Duration of shelf life (number)
        unit: 'days', // Unit for shelf life duration (string)
      },
    },
  },
];

console.log(ingredients);
