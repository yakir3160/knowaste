/**
 * Calculates summary statistics for a sales report
 * @param {Array} items - Array of sale items with quantity and totalPrice
 * @returns {Object} Summary containing totalItems, totalSales, totalSalesPreTax, and tax
 * @throws {Error} If items array is empty or contains invalid data
 */

export const calculateSalesSummary = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Items must be a non-empty array');
    }

    const TAX_RATE = 0.17; // 17% VAT

    // Calculate total sales first as it's used in multiple calculations
    const totalSales = items.reduce((sum, item) => {
        if (typeof item.totalPrice !== 'number') {
            throw new Error('Invalid item price');
        }
        return sum + item.totalPrice;
    }, 0);

    // Calculate tax and pre-tax amount
    const tax = totalSales * TAX_RATE;
    const totalSalesPreTax = totalSales - tax;

    // Calculate total quantity of items
    const totalItems = items.reduce((sum, item) => {
        if (typeof item.quantity !== 'number') {
            throw new Error('Invalid item quantity');
        }
        return sum + item.quantity;
    }, 0);

    return {
        totalItems,
        totalSales,
        totalSalesPreTax,
        tax
    };
};

/**
 * Calculates summary statistics for a waste report
 * @param {Array} items - Array of waste items with quantity and cost
 * @returns {Object} Summary containing totalItems and totalCost
 * @throws {Error} If items array is empty or contains invalid data
 */
export const calculateWasteSummary = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Items must be a non-empty array');
    }

    // Calculate totals with validation
    const totalItems = items.reduce((sum, item) => {
        if (typeof item.quantity !== 'number') {
            throw new Error('Invalid item quantity');
        }
        return sum + item.quantity;
    }, 0);

    const totalCost = items.reduce((sum, item) => {
        if (typeof item.cost !== 'number') {
            throw new Error('Invalid item cost');
        }
        return sum + item.cost;
    }, 0);

    return {
        totalItems,
        totalCost
    };
};