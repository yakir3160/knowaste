
import Card from "../../../Common/Card/Card";


const SalesList = ({ sales }) => {
    console.log(sales)
    return(
        <Card>
            <div className="flex justify-between items-center">
                <h2 className="text-titles text-2xl font-semibold">Sales</h2>
            </div>
            <div className="grid grid-cols-1  gap-2">
                {sales.map((sale, index) => (
                    <Card key={index} className="">
                        <div className={`flex flex-row justify-around`}>
                            <p className="text-sm text-titles">{sale.date}</p>
                            <span className="text-titles">Total Sales pre Tax: {sale.totalSalesPreTax} ₪</span>
                            <strong>Total Sales: {sale.totalSales} ₪</strong>
                        </div>
                        <div className={`text-titles border-2 border-secondary`}>
                            {sale.items.map((item) => (
                                <div key={item.id} className={`text-titles`}>
                                    <span className="text-lg font-semibold">Name : {item.menuItem}</span>
                                    <span className="text-sm "> Quantity {item.quantity}</span>
                                    <span className="text-sm"> Total Sales {item.totalPrice} ₪</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </Card>
    );
}
export default SalesList;