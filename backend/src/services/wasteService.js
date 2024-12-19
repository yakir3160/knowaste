import {db} from '../../config/firebase-admin.js';
import { FieldValue } from 'firebase-admin/firestore';

class WasteService {
    async addWasteReport(wasteData) {
        try {
            console.log('Starting add waste report process');
            const userReportRef = db.collection('userReports').doc(wasteData.userId);
            const doc = await userReportRef.get();

            const newReport = {
                ...wasteData,
                timestamp: new Date()
            };

            if (!doc.exists) {
                await userReportRef.set({
                    wasteReports: [newReport],
                    salesReports: [],
                    priceQuotes: []
                });
            } else {
                await userReportRef.update({
                    wasteReports: FieldValue.arrayUnion(newReport)
                });
            }

            console.log('Waste report added successfully');
            return true;
        } catch (error) {
            console.error('Error adding waste:', error);
            return false;
        }
    }


    async getWasteReports(userId) {
        try {
            console.log('Fetching waste reports...');
            const userDoc = await db.collection('userReports').doc(userId).get();

            if (!userDoc.exists) {
                return [];
            }

            const userData = userDoc.data();
            return userData.wasteReports || [];
        } catch (error) {
            console.error('Error fetching waste reports:', error);
            return [];
        }
    }

    async deleteWasteReport(userId, reportToDelete) {
        try {
            console.log('Starting delete waste process');
            const userRef = db.collection('userReports').doc(userId);

            const doc = await userRef.get();
            if (!doc.exists) {
                return false;
            }

            const userData = doc.data();
            const updatedReports = userData.wasteReports.filter(report =>
                report.timestamp.toDate().getTime() !== reportToDelete.timestamp.toDate().getTime()
            );

            await userRef.update({
                wasteReports: updatedReports
            });

            console.log('Waste report deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting waste:', error);
            return false;
        }
    }
}

export default new WasteService();
