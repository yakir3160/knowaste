//import WasteService from "../services/wasteService.js";
import ReportService from "../services/ReportService.js";


export const addWasteReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const reportData = req.body;
        const result = await ReportService.addOrUpdateReport('waste', userId, reportData);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                error: result.error
            });
        }

        res.status(201).json({
            success: true,
            data: result.data,
            message: result.message
        });
    } catch (error) {
        console.error("Add waste report error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error adding waste report"
        });
    }
};

export const getWasteReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const reports = await ReportService.getReports('waste', userId);

        res.status(200).json({
            success: true,
            data: reports,
            message: "Waste reports fetched successfully"
        });
    } catch (error) {
        console.error("Get waste reports error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error fetching waste reports"
        });
    }
};

export const deleteWasteReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const reportId = req.params.id;
        const result = await ReportService.deleteReport('waste', userId, reportId);

        res.status(200).json({
            success: true,
            data: result,
            message: "Waste report deleted successfully"
        });
    } catch (error) {
        console.error("Delete waste error:", error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || "Error deleting waste report"
        });
    }
};