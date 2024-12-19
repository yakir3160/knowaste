import {db} from '../../config/firebase-admin.js';

class SalesService {
    async addSalesReport(saleData) {
        try {
            console.log('Starting add sale process');

            console.log('Adding sale to database...');
            await db.collection('sales').add(saleData);
            console.log('Sale added successfully');
            return true;
        } catch (error) {
            console.error('Error adding sale:', error);
            return false;
        }
    }
    async getSalesReports() {
        try {
            console.log('Starting get sales process');

            console.log('Fetching sales...');
            const saleDocs = await db.collection('sales').get();
            const sales = saleDocs.docs.map(saleDoc => saleDoc.data());
            console.log('Sales fetched successfully');
            return sales;
        } catch (error) {
            console.error('Error fetching sales:', error);
            return [];
        }
    }
    async deleteSalesReport(saleId) {
        try {
            console.log('Starting delete sale process');

            console.log('Deleting sale from database...');
            await db.collection('sales').doc(saleId).delete();
            console.log('Sale deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting sale:', error);
            return false;
        }
    }

}

export default new SalesService();