import {db} from '../../config/firebase-admin.js';

class WasteService {
    async addWasteReport(wasteData) {
        try {
            console.log('Starting add waste process');

            console.log('Adding waste to database...');
            await db.collection('waste').add(wasteData);
            console.log('Waste added successfully');
            return true;
        } catch (error) {
            console.error('Error adding waste:', error);
            return false;
        }
    }
    async getWasteReports() {
        try {
            console.log('Starting get waste reports process');

            console.log('Fetching waste reports...');
            const wasteDocs = await db.collection('waste').get();
            const wasteReports = wasteDocs.docs.map(wasteDoc => wasteDoc.data());
            console.log('Waste reports fetched successfully');
            return wasteReports;
        } catch (error) {
            console.error('Error fetching waste reports:', error);
            return [];
        }
    }
    async deleteWasteReport(wasteId) {
        try {
            console.log('Starting delete waste process');

            console.log('Deleting waste from database...');
            await db.collection('waste').doc(wasteId).delete();
            console.log('Waste deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting waste:', error);
            return false;
        }
    }

}

export default new WasteService();