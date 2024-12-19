export const validateReportType = (req, res, next) => {
    const allowedReportTypes = ['waste', 'sales', 'price-quotes'];
    const { reportType } = req.params;

    console.log(`Validating report type: ${reportType}`);

    if (!allowedReportTypes.includes(reportType)) {
        console.log(`Blocked attempt to access invalid report type: ${reportType}`);
        return res.status(400).json({
            success: false,
            message: `Invalid report type. Allowed types are: ${allowedReportTypes.join(', ')}`
        });
    }

    next();
};
