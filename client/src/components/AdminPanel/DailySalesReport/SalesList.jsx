import React, { useState } from 'react';
import { tableStyles } from '../../../css/tableStyles';
import Card from "../../Common/Card/Card";
import { CircleX } from "lucide-react";
import { useItemsContext } from "../../../context/ItemsContext";
import ConfirmDelete from "../../Common/ConfirmDelete/ConfirmDelete";

const SalesList = ({ salesReports = [] }) => {
    const { deleteReport } = useItemsContext();
    const [reportToDelete, setReportToDelete] = useState(null);

    // Sort salesReports by date (newest first)
    const sortedSalesReports = [...salesReports].sort((a, b) => {
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
                <h1 className="text-2xl text-center mb-5">Sales</h1>
                <table className="min-w-full border-collapse">
                    <thead>
                    <tr className="bg-secondary">
                        <th className={tableStyles.thClass}>Date</th>
                        <th className={tableStyles.thClass}>Total Sales Pre Tax (₪)</th>
                        <th className={tableStyles.thClass}>Total Sales (₪)</th>
                        <th className={tableStyles.thClass}>Dishes Sold</th>
                        <th className={tableStyles.thClass}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedSalesReports?.map((sale) => (
                        <React.Fragment key={sale.id}>
                            <tr className="bg-white border-b">
                                <td className={tableStyles.tableCellClass}>
                                    {new Date(sale.date).toLocaleDateString('en-GB')}
                                </td>
                                <td className={tableStyles.tableCellClass}>{sale.summary.totalSalesPreTax.toFixed(2)} ₪</td>
                                <td className={tableStyles.tableCellClass}>{sale.summary.totalSales} ₪</td>
                                <td className={tableStyles.tableCellClass}>
                                    {sale.items.map((dish, index) => (
                                        <div className="border-b-2 border-gray py-2" key={dish.id}>
                                            {index + 1}. {dish.menuItem} -
                                            {dish.quantity} {dish.quantity > 1 ? 'dishes' : 'dish'}
                                        </div>
                                    ))}
                                </td>
                                <td className={tableStyles.tableCellClass}>
                                    <button
                                        onClick={() => handleDeleteClick(sale.reportId)}
                                        className="text-errorRed"
                                    >
                                        <CircleX size={20}/>
                                    </button>
                                </td>
                            </tr>

                            {reportToDelete === sale.reportId && (
                                <tr className="bg-white border-b">
                                    <td colSpan="6" className="p-3">
                                        <ConfirmDelete
                                            isOpen={true}
                                            name={`Sales Report from ${new Date(sale.date).toLocaleDateString('en-GB')}`}
                                            onConfirm={() => {
                                                deleteReport('sales', reportToDelete);
                                                setReportToDelete(null);
                                            }}
                                            onCancel={handleCancelDelete}
                                        />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default SalesList;