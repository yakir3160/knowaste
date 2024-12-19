import SalesService from "../services/salesService.js";

export const addSalesReport = async (req, res) => {
    try {
        const { salesReportData } = req.body;
        const result = await SalesService.addSalesReport(salesReportData);
        res.status(200).json({
            success: true,
            data: result,
            error: "Sales report added successfully"
        });
    } catch (error) {
        console.error("Add sales report error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error adding sales report"
        });
    }
}
export const getSalesReports = async (req, res) => {
    try {
        const salesReports = await SalesService.getSalesReports();
        res.status(200).json({
            success: true,
            data: salesReports,
            error: "Sales reports fetched successfully"
        });
    } catch (error) {
        console.error("Get sales reports error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching sales reports"
        });
    }
}
export const deleteSalesReport = async (req, res) => {
    try {
        const { salesReportId } = req.body;
        const result = await SalesService.deleteSalesReport(salesReportId);
        res.status(200).json({
            success: true,
            data: result,
            error: "Sales report deleted successfully"
        });
    } catch (error) {
        console.error("Delete sales report error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error deleting sales report"
        });
    }
}
