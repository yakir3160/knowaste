import SalesService from "../services/salesService.js";

export const addSalesReport = async (req, res) => {
    try {
        const salesData = req.body;
        console.log('salesData:', salesData);
        const result = await SalesService.addSalesReport(salesData);
        res.status(200).json({
            success: true,
            data: result,
            error: "Sale added successfully"
        });
    } catch (error) {
        console.error("Add sale error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error adding sale"
        });
    }
}
export const getSalesReports = async (req, res) => {
    try {
        const sales = await SalesService.getSalesReports();
        res.status(200).json({
            success: true,
            data: sales,
            error: "Sales fetched successfully"
        });
    } catch (error) {
        console.error("Get sales error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching sales"
        });
    }
}
export const deleteSalesReport = async (req, res) => {
    try {
        const saleId = req.params.id;
        console.log('saleId:', saleId);
        const result = await SalesService.deleteSalesReport(saleId);
        res.status(200).json({
            success: true,
            data: result,
            error: "Sale deleted successfully"
        });
    } catch (error) {
        console.error("Delete sale error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error deleting sale"
        });
    }
}
