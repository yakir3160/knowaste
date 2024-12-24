import ReportService from "../services/ReportService.js";

export const addReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const type = req.params.type;
        const reportData = req.body;

        const result = await ReportService.addOrUpdateReport(type, userId, reportData);

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
        console.error(`Add ${type} report error:`, error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || `Error adding ${type} report`
        });
    }
};

export const getReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const type = req.params.type;
        const reports = await ReportService.getReports(type, userId);

        res.status(200).json({
            success: true,
            data: reports,
            message: `${type} reports fetched successfully`
        });
    } catch (error) {
        console.error(`Get ${type} reports error:`, error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || `Error fetching ${type} reports`
        });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const type = req.params.type;
        const reportId = req.params.id;

        const result = await ReportService.deleteReport(type, userId, reportId);

        res.status(200).json({
            success: true,
            data: result,
            message: `${type} report deleted successfully`
        });
    } catch (error) {
        console.error(`Delete ${type} report error:`, error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || `Error deleting ${type} report`
        });
    }
};

export const updateReportStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const type = req.params.type;
        const reportId = req.params.id;
        const { status } = req.body;

        const result = await ReportService.updateReportStatus(type, userId, reportId, status);

        res.status(200).json({
            success: true,
            message: result.message
        });
    } catch (error) {
        console.error(`Update ${type} report status error:`, error);
        res.status(error.status || 500).json({
            success: false,
            error: error.message || `Error updating ${type} report status`
        });
    }
};