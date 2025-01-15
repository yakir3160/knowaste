import { db } from '../../config/firebase-admin.js';
import { validateSchema } from '../models/index.js';
import { calculateWasteSummary } from '../models/helpers/reportCalculations.js';

class WasteService {
    async addOrUpdateWasteReport(userId, reportData) {
        try {
            console.log('Starting add/update waste report process');

            // Validate the report data
            const validation = await validateSchema(`${type}Report`, reportData);

            if (!validation.success) {
                throw new Error(validation.error);
            }


            // Prepare report data with timestamps and calculations
            const now = new Date();
            const summary = calculateWasteSummary(reportData.items);
            const enrichedReportData = {
                ...reportData,
                updatedAt: now,
                status: reportData.status || 'draft',
                summary
            };

            // Reference to the waste reports collection
            const wasteReportRef = db
                .collection('users')
                .doc(userId)
                .collection('reports')
                .doc('waste')
                .collection('wasteReports')
                .doc(reportData.reportId || db.collection('_').doc().id);

            // Check if report exists and update or create
            const existingReport = await wasteReportRef.get();
            if (existingReport.exists) {
                await wasteReportRef.update(enrichedReportData);
                console.log('Updated existing waste report');
                return {
                    success: true,
                    message: 'Waste report updated successfully',
                    reportId: wasteReportRef.id
                };
            } else {
                await wasteReportRef.set(enrichedReportData);
                console.log('Created new waste report');
                return {
                    success: true,
                    message: 'New waste report created successfully',
                    reportId: wasteReportRef.id
                };
            }
        } catch (error) {
            console.error('Error in addOrUpdateWasteReport:', error);
            return { success: false, error: error.message };
        }
    }

    async getWasteReports(userId, filters = {}) {
        try {
            console.log('Fetching waste reports with filters:', filters);

            let query = db
                .collection('users')
                .doc(userId)
                .collection('reports')
                .doc('waste')
                .collection('wasteReports');

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
            if (filters.reason) {
                // For filtering by waste reason, we might need a different approach
                // since items array cannot be directly queried
                console.log('Reason filtering will be applied post-query');
            }

            const snapshot = await query.get();
            let reports = snapshot.docs.map(doc => ({
                reportId: doc.id,
                ...doc.data()
            }));

            // Apply post-query filters if needed
            if (filters.reason) {
                reports = reports.filter(report =>
                    report.items.some(item => item.reason === filters.reason)
                );
            }

            return {
                success: true,
                data: reports,
                message: 'Waste reports fetched successfully'
            };
        } catch (error) {
            console.error('Error fetching waste reports:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteWasteReport(userId, reportId) {
        try {
            console.log(`Deleting waste report: ${reportId}`);

            await db
                .collection('users')
                .doc(userId)
                .collection('reports')
                .doc('waste')
                .collection('wasteReports')
                .doc(reportId)
                .delete();

            return { success: true, message: 'Waste report deleted successfully' };
        } catch (error) {
            console.error('Error deleting waste report:', error);
            return { success: false, error: error.message };
        }
    }

    async updateReportStatus(userId, reportId, newStatus) {
        try {
            console.log(`Updating status for report ${reportId} to ${newStatus}`);

            await db
                .collection('users')
                .doc(userId)
                .collection('reports')
                .doc('waste')
                .collection('wasteReports')
                .doc(reportId)
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

export default new WasteService();