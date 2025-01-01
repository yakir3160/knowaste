import { db } from '../../config/firebase-admin.js';
import { validateSchema } from '../models/index.js';
import {
    calculateSalesSummary,
    calculateWasteSummary
} from '../models/helpers/reportCalculations.js';
import inventoryService from "./inventoryService.js";

class ReportService {
    getCalculationFunction(type) {
        switch(type) {
            case 'sales':
                return calculateSalesSummary;
            case 'waste':
                return calculateWasteSummary;
            default:
                throw new Error('Invalid report type');
        }
    }

    async addOrUpdateReport(type, userId, reportData) {
        try {
            console.log(`Starting add/update ${type} report process`);

            // Validate based on report type
            const validation = await validateSchema(`${type}Report`, reportData);
            if (!validation.success) {
                throw new Error(validation.error);
            }

            // Calculate summary based on report type
            const calculateSummary = this.getCalculationFunction(type);
            const summary = calculateSummary(reportData.items);

            const now = new Date();
            const enrichedReportData = {
                ...reportData,
                updatedAt: now,
                status: reportData.status || 'draft',
                summary
            };

            const reportRef = db
                .collection('users').doc(userId)
                .collection('reports').doc(type)
                .collection(`${type}Reports`)
                .doc(reportData.reportId || db.collection('_').doc().id);

            const existingReport = await reportRef.get();

            if (existingReport.exists) {
                await reportRef.update(enrichedReportData);
                //only update inventory if its a sales report being submitted
                if (type === 'sales' && reportData.status === 'submitted') {
                    await inventoryService.updateInventoryFromSales(userId, reportData);
                    }
                return {
                    success: true,
                    message: `${type} report updated successfully`,
                    reportId: reportRef.id
                };
            } else {
                await reportRef.set(enrichedReportData);
                if (type === 'sales' && reportData.status === 'submitted') {
                    await inventoryService.updateInventoryFromSales(userId, reportData);
                }
                return {
                    success: true,
                    message: `New ${type} report created successfully`,
                    reportId: reportRef.id
                };
            }
        } catch (error) {
            console.error(`Error in addOrUpdate${type}Report:`, error);
            return { success: false, error: error.message };
        }
    }

    async getReports(type, userId, filters = {}) {
        try {
            let query = db
                .collection('users').doc(userId)
                .collection('reports').doc(type)
                .collection(`${type}Reports`);

            // Apply common filters
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
            let reports = snapshot.docs.map(doc => ({
                reportId: doc.id,
                ...doc.data()
            }));

            // Handle special filters for waste reports
            if (type === 'waste' && filters.reason) {
                reports = reports.filter(report =>
                    report.items.some(item => item.reason === filters.reason)
                );
            }

            return {
                success: true,
                data: reports,
                message: `${type} reports fetched successfully`
            };
        } catch (error) {
            console.error(`Error fetching ${type} reports:`, error);
            return { success: false, error: error.message };
        }
    }

    async deleteReport(type, userId, reportId) {
        try {
            await db
                .collection('users').doc(userId)
                .collection('reports').doc(type)
                .collection(`${type}Reports`)
                .doc(reportId)
                .delete();

            return {
                success: true,
                message: `${type} report deleted successfully`
            };
        } catch (error) {
            console.error(`Error deleting ${type} report:`, error);
            return { success: false, error: error.message };
        }
    }

    async updateReportStatus(type, userId, reportId, newStatus) {
        try {
            await db
                .collection('users').doc(userId)
                .collection('reports').doc(type)
                .collection(`${type}Reports`)
                .doc(reportId)
                .update({
                    status: newStatus,
                    updatedAt: new Date()
                });

            return { success: true, message: 'Report status updated successfully' };
        } catch (error) {
            console.error(`Error updating ${type} report status:`, error);
            return { success: false, error: error.message };
        }
    }
}

export default new ReportService();