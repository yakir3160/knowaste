import Card from "../../Common/Card/Card";
import { tableStyles } from '../../../css/tableStyles';

const SalesList = ({ salesReports }) => {
    console.log('Sales Reports:', salesReports);
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
                        <th className={tableStyles.thClass}>Quantity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {salesReports.map((sale) => (
                        <tr key={sale.id} className="bg-white border-b">
                            <td className={tableStyles.tableCellClass}>{sale.date}</td>
                            <td className={tableStyles.tableCellClass}>{sale.summary.totalSalesPreTax}</td>
                            <td className={tableStyles.tableCellClass}>{sale.summary.totalSales}</td>

                            {/* שדות עבור המנות והכמויות */}
                            <td className={tableStyles.tableCellClass}>
                                {sale.items.map((dish,index) => (
                                    <div className={`border-b-2 border-gray py-2`} key={dish.id}>{index+1}. {dish.menuItem}</div>
                                ))}
                            </td>
                            <td className={tableStyles.tableCellClass}>
                                {sale.items.map((dish, dishIndex) => (
                                    <div className={`border-b-2 border-gray py-2`}  key={dishIndex}>{dish.quantity}</div>
                                ))}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default SalesList;
