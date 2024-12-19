import { db } from '../../config/firebase-admin.js';
import { FieldValue } from 'firebase-admin/firestore';

class ReportService {


    async addReport(userId, reportType, reportData) {
        try {
            console.log(`Starting addReport process for ${reportType}`);
            const collectionName = this.getCollectionName(reportType);
            const userReportRef = db.collection('userReports').doc(userId);
            const doc = await userReportRef.get();

            const newReport = {
                ...reportData,
                id: Date.now().toString(),
                timestamp: new Date(),
                userId
            };
            console.log('Created new report object:', newReport);

            if (!doc.exists) {
                console.log('Creating new user document with initial reports');
                const initialData = {
                    wasteReports: [],
                    salesReports: [],
                    priceQuotes: []
                };
                initialData[collectionName] = [newReport];
                await userReportRef.set(initialData);
                console.log('Successfully created new user document with report');
            } else {
                console.log('Adding report to existing user document');
                await userReportRef.update({
                    [collectionName]: FieldValue.arrayUnion(newReport)
                });
                console.log('Successfully added report to existing document');
            }

            console.log('Report addition completed successfully');
            return newReport;
        } catch (error) {
            console.error('Error in addReport:', error);
            console.error('Stack:', error.stack);
            throw new Error(`Failed to add ${reportType} report: ${error.message}`);
        }
    }

    async getReports(userId, reportType) {
        try {
            console.log(`Fetching ${reportType} reports for user:`, userId);
            const userDoc = await db.collection('userReports').doc(userId).get();
            const collectionName = this.getCollectionName(reportType);

            if (!userDoc.exists) {
                console.log('No document found for user');
                return [];
            }

            const userData = userDoc.data();
            const reports = userData[collectionName] || [];
            console.log(`Found ${reports.length} ${reportType} reports`);
            return reports;
        } catch (error) {
            console.error('Error in getReports:', error);
            console.error('Stack:', error.stack);
            throw new Error(`Failed to fetch ${reportType} reports: ${error.message}`);
        }
    }
    async deleteReport(userId, reportType, reportId) {
        try {
            console.log(`Deleting ${reportType} report`, { userId, reportId, reportType });

            const userRef = db.collection('userReports').doc(userId);
            const collectionName = this.getCollectionName(reportType);

            await userRef.update({
                [collectionName]: FieldValue.arrayRemove(reportId)
            });

            console.log('Report deleted successfully');
            return true;
        } catch (error) {
            console.error('Error in deleteReport:', error);
            console.error('Stack:', error.stack);
            throw new Error(`Failed to delete ${reportType} report: ${error.message}`);
        }
    }



    getCollectionName(type) {
        switch(type) {
            case 'waste': return 'wasteReports';
            case 'sales': return 'salesReports';
            case 'price-quotes': return 'priceQuotes';
            default: return type;
        }
    }
}

export default new ReportService();
