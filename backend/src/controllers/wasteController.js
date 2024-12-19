import WasteService from "../services/wasteService.js";

export const addWasteReport = async (req, res) => {
    try {
        const { wasteReportData } = req.body;
        const result = await WasteService.addWasteReport(wasteReportData);
        res.status(200).json({
            success: true,
            data: result,
            error: "Waste report added successfully"
        });
    } catch (error) {
        console.error("Add waste report error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error adding waste report"
        });
    }
}
export const getWasteReports = async (req, res) => {
    try {
        const wasteReports = await WasteService.getWasteReports();
        res.status(200).json({
            success: true,
            data: wasteReports,
            error: "Waste reports fetched successfully"
        });
    } catch (error) {
        console.error("Get waste reports error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching waste reports"
        });
    }
}
export const deleteWasteReport = async (req, res) => {
    try {
        const { wasteReportId } = req.body;
        const result = await WasteService.deleteWasteReport(wasteReportId);
        res.status(200).json({
            success: true,
            data: result,
            error: "Waste report deleted successfully"
        });
    } catch (error) {
        console.error("Delete waste report error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error deleting waste report"
        });
    }
}