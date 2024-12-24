import * as Yup from "yup";

// Define all possible report types - this makes our system extensible
const REPORT_TYPES = {
    SALES: 'sales',
    WASTE: 'waste'
};
// Define all possible report statuses
const REPORT_STATUSES = {
    DRAFT: 'draft',
    SUBMITTED: 'submitted',
    APPROVED: 'approved'
};

const baseReportSchema = Yup.object({
    reportType: Yup.string()
        .oneOf(Object.values(REPORT_TYPES), 'Invalid report type')
        .required('Report type is required'),
    date: Yup.date()
        .required('Report date is required'),
    status: Yup.string()
        .oneOf(Object.values(REPORT_STATUSES))
        .default(REPORT_STATUSES.DRAFT),
    items: Yup.array().min(1, 'At least one item is required'),
    summary: Yup.object()
});


export {
    REPORT_TYPES,
    REPORT_STATUSES,
    baseReportSchema
};