//import SalesService from "../services/salesService.js";
import ReportService from "../services/ReportService.js";


export const addSalesReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const reportData = req.body;
        const result = await ReportService.addOrUpdateReport('sales', userId, reportData);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error
            });
        }

        res.status(201).json({
            success: true,
            data: result,
            message: result.message
        });
    } catch (error) {
        console.error("Add sale error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error adding sale"
        });
    }
};

export const getSalesReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const reports = await ReportService.getReports('sales', userId);

        res.status(200).json({
            success: true,
            data: reports,
            message: "Sales reports fetched successfully"
        });
    } catch (error) {
        console.error("Get sales error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching sales"
        });
    }
};

export const deleteSalesReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const reportId = req.params.id;
        const result = await ReportService.deleteReport('sales', userId, reportId);

        res.status(200).json({
            success: true,
            data: result,
            message: "Sale deleted successfully"
        });
    } catch (error) {
        console.error("Delete sale error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error deleting sale"
        });
    }
};