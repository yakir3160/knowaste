
export const getDateRange = (timeframe) => {
    let startDate = new Date();
    const endDate = new Date();

    switch (timeframe) {
        case 'week':
            startDate = new Date(endDate);
            startDate.setDate(endDate.getDate() - endDate.getDay());
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'month':
            startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'year':
            startDate = new Date(endDate.getFullYear(), 0, 1);
            startDate.setHours(0, 0, 0, 0);
            break;
        default:
            return null;
    }

    return { startDate, endDate };
};
