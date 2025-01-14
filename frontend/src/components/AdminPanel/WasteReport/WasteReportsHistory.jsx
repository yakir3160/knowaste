import React, { useState } from 'react';
import { tableStyles } from '../../../css/tableStyles';
import Card from "../../Common/Card/Card";
import { CircleX } from "lucide-react";
import { useItemsContext } from "../../../contexts/ItemsContext";
import ConfirmDelete from "../../Common/ConfirmDelete/ConfirmDelete";

const WasteReportsHistory = ({ wasteReports }) => {
    const { deleteReport } = useItemsContext();
    const [reportToDelete, setReportToDelete] = useState(null); // State for selected report


    const sortedWasteReports = [...wasteReports].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    const handleDeleteClick = (reportId) => {
        setReportToDelete(reportId);
    };

    const handleCancelDelete = () => {
        setReportToDelete(null);
    };

    return (
        <Card>
            <div className="overflow-x-auto">
                <h1 className="text-2xl text-center text-titles mb-5">Waste Reports History</h1>
                <table className="min-w-full border-collapse">
                    <thead>
                    <tr className="bg-secondary">
                        <th className={tableStyles.thClass}>Date</th>
                        <th className={tableStyles.thClass}>Items</th>
                        <th className={tableStyles.thClass}>Total Cost (₪)</th>
                        <th className={tableStyles.thClass}>Total Items</th>
                        <th className={tableStyles.thClass}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedWasteReports.map((report) => (
                        <>
                            <tr key={report.reportId} className="bg-white border-b">
                                <td className={tableStyles.tableCellClass}>
                                    {new Date(report.date).toLocaleDateString('en-GB')}
                                </td>
                                <td className={tableStyles.tableCellClass}>
                                    {report.items.map((item, index) => (
                                        <div className={`border-b-2 border-gray py-2`}  key={item.ingredientId}>
                                            {index + 1}. {item.ingredientName}
                                        </div>
                                    ))}
                                </td>
                                <td className={tableStyles.tableCellClass}>
                                    {report.summary.totalCost.toFixed(2)}
                                </td>
                                <td className={tableStyles.tableCellClass}>{report.summary.totalItems}</td>
                                <td className={tableStyles.tableCellClass}>
                                    <button
                                        onClick={() => handleDeleteClick(report.reportId)}
                                        className="text-errorRed"
                                    >
                                        <CircleX size={20}/>
                                    </button>
                                </td>
                            </tr>

                            {reportToDelete === report.reportId && (
                                <tr className="bg-white border-b">
                                    <td colSpan="5" className={`p-3`}> {/* תופס את כל העמודות */}
                                        <ConfirmDelete
                                            isOpen={true}
                                            name={`Waste Report from ${report.date}`}
                                            onConfirm={() => {
                                                deleteReport('waste',report.reportId);
                                                setReportToDelete(null); // Reset state after deletion
                                            }}
                                            onCancel={handleCancelDelete}
                                        />
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default WasteReportsHistory;
