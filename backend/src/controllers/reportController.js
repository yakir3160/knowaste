import ReportService from '../services/ReportService.js';

export const addReport = async (req, res) => {
    try {
        const { reportType } = req.params;
        const userId = req.user.id;
        const reportData = req.body;

        const newReport = await ReportService.addReport(userId, reportType, reportData);
        res.status(201).json({
            success: true,
            message: `${reportType} report added successfully`,
            data: newReport
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error adding ${reportType} report`,
            error: error.message
        });
    }
};

export const getReports = async (req, res) => {
    try {
        const { reportType, userId } = req.params;
        const reports = await ReportService.getReports(userId, reportType);

        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error fetching ${reportType} reports`,
            error: error.message
        });
    }
};

export const deleteReport = async (req, res) => {
    try {
        const { reportType, userId, reportId } = req.params;
        await ReportService.deleteReport(userId, reportType, reportId);

        res.status(200).json({
            success: true,
            message: `${reportType} report deleted successfully`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error deleting ${reportType} report`,
            error: error.message
        });
    }
};
