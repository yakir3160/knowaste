export const calculateTotal = (ingredients, inventoryItems) => {
    return ingredients.reduce((total, ing) => {
        const item = inventoryItems.find(item => item.id.toString() === ing.itemId);
        if (item) {
            return total + (item.lastPrice * ing.quantity);
        }
        return total;
    }, 0);
};

export const getUnitOptions = (itemId, inventoryItems) => {
    const item = inventoryItems.find(item => item.id.toString() === itemId);
    if (!item) return [{ value: 'kg', label: 'kg' }];

    switch (item.defaultUnit) {
        case 'kg':
        case 'g':
            return [
                { value: 'kg', label: 'kg' },
                { value: 'g', label: 'g' }
            ];
        case 'l':
        case 'ml':
            return [
                { value: 'l', label: 'l' },
                { value: 'ml', label: 'ml' }
            ];
        case 'units':
            return [{ value: 'units', label: 'units' }];
        default:
            return [{ value: item.defaultUnit, label: item.defaultUnit }];
    }
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'Completed':
            return ' bg-green';
        case 'Draft':
            return ' bg-gray text-white';
        case 'Pending':
            return 'bg-[yellow] animate-pulse';
        default:
            return 'bg-gray';
    }
};
