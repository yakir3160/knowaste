export const PRICE_QUOTE_STATUS = {
    DRAFT: 'Draft',
    PENDING: 'Pending',
    COMPLETED: 'Completed'
};

export const UNITS = {
    KG: 'kg',
    G: 'g',
    L: 'l',
    ML: 'ml',
    UNITS: 'units'
};

export const INVENTORY_ITEM_STRUCTURE = {
    id: 'number',
    name: 'string',
    defaultUnit: 'string',
    lastPrice: 'number',
    minQuantity: 'number',
    category: 'string'
};

export const QUOTE_INGREDIENT_STRUCTURE = {
    id: 'number',
    itemId: 'string',
    quantity: 'number',
    unit: 'string',
    notes: 'string'
};

export const PRICE_QUOTE_STRUCTURE = {
    id: 'string',
    userId: 'string',
    businessId: 'string',
    createdAt: 'Date',
    status: 'string',
    ingredients: 'Array',
    items: 'number',
    total: 'number',
    createdBy: 'string',
    date: 'string'
};