import {db} from '../../config/firebase-admin.js';
import { validateSchema } from "../models/index.js";
import { calculateSalesSummary } from '../models/helpers/reportCalculations.js';


class SalesService {
    async addOrUpdateSalesReport(userId, reportData) {
        try {
            console.log('Starting add/update sales report process');

            // Validate the report data
            const validation = await validateSchema(`${type}Report`, reportData);

            if (!validation.success) {
                throw new Error(validation.error);
            }

            const summary = calculateSalesSummary(reportData.items);

            // Prepare report data with timestamps and default values
            const now = new Date();
            const enrichedReportData = {
                ...reportData,
                updatedAt: now,
                status: reportData.status || 'draft',
                summary
            };

            // Reference to the sales reports collection
            const salesReportsRef = db
                .collection('users').doc(userId)
                .collection('reports').doc('sales')
                .collection('salesReports').doc(reportData.reportId || db.collection('_').doc().id);

            // Check if report exists and update or create
            const existingReport = await salesReportsRef.get();
            if (existingReport.exists) {
                await salesReportsRef.update(enrichedReportData);
                console.log('Updated existing sales report');
                return {success: true, message: 'Report updated successfully', reportId: salesReportRef.id};
            } else {
                await salesReportsRef.set(enrichedReportData);
                console.log('Added new sales report');
                return {success: true, message: 'New report added successfully', reportId: salesReportRef.id};
            }
        } catch (error) {
            console.error('Error adding/updating sales report:', error);
            return {success: false, error: error.message};
        }
    }

    async getSalesReports(userId, filters = {}) {
        try {
            console.log('Fetching sales reports with filters:', filters);

            let query = db.collection('users').doc(userId)
                .collection('reports').doc('sales')
                .collection('salesReports');

            // Apply filters
            if (filters.status) {
                query = query.where('status', '==', filters.status);
            }
            if (filters.startDate) {
                query = query.where('date', '>=', filters.startDate);
            }
            if (filters.endDate) {
                query = query.where('date', '<=', filters.endDate);
            }

            const snapshot = await query.get();
            const reports = snapshot.docs.map(doc =>({
                reportId: doc.id,
                ...doc.data()
            }));

            return {success: true, data: reports, message: 'Sales reports fetched successfully'};
        } catch (error) {
            console.error('Error fetching sales reports:', error);
            return {success: false, error: error.message};
        }
    }

    async deleteSalesReport(userId, reportId) {
        try {
            console.log(`Deleting sales report: ${reportId}`);

            await db
                .collection('users').doc(userId)
                .collection('reports').doc('sales')
                .collection('salesReports').doc(reportId)
                .delete();

            return { success: true, message: 'Sales report deleted successfully' };
        } catch (error) {
            console.error('Error deleting sales report:', error);
            return { success: false, error: error.message };
        }
    }
    async updateReportStatus(userId, reportId, newStatus) {
        try {
            console.log(`Updating status for report ${reportId} to ${newStatus}`);

            await db
                .collection('users').doc(userId)
                .collection('reports').doc('sales')
                .collection('salesReports').doc(reportId)
                .update({
                    status: newStatus,
                    updatedAt: new Date()
                });

            return { success: true, message: 'Report status updated successfully' };
        } catch (error) {
            console.error('Error updating report status:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new SalesService();