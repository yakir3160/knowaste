import Button from "../../../Common/Button/Button";
import Card from "../../../Common/Card/Card";

const LowStockItems = ({ data }) => {
    const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
    return (
        <Card className="text-lg font-semibold text-titles ">
            {/* כותרת ראשית וכפתור */}
            <div className="flex justify-between items-center mb-4">
                <h1>Low Stock Items</h1>
                <Button className="border-2 border-lime" to="/admin-panel/inventory-management">
                    Restock
                </Button>
            </div>

            {/* כותרות העמודות */}
            <div className="flex justify-between px-2 font-medium">
                <h2 className="w-2/5">Item Name</h2>
                <h2 className="w-1/5 text-center">Current Stock</h2>
                <h2 className="w-1/5 pr-2 text-right">Minimum Stock</h2>
                <h2 className="w-1/5 pr-5 text-right">Stock Deficit</h2>
            </div>

            {/* רשימה עם גלילה */}
            <div className="max-h-64 overflow-y-auto">
                {sortedData.map((item) => (
                    <div
                        key={item.id}
                        className="bg-base p-2 rounded-sm flex justify-between items-center mb-2"
                    >
                        <h2 className="w-2/4 break-words">{item.name}</h2>
                        <h3 className="w-1/4 pl-2 text-center text-errorRed animate-pulse">{item.currentStock}  {item.unit} </h3>
                        <h3 className="w-1/4 pr-12 text-right">{item.minStockLevel} {item.unit}</h3>
                        <h3 className="w-1/4 pr-7 text-right">{item.stockDeficit} {item.unit}</h3>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default LowStockItems;
