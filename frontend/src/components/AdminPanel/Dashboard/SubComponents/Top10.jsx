import Card from "../../../Common/Card/Card";
import React from "react";
import useFormatNumberWithCommas from "../../../../Hooks/Items/useFormatNumberWithCommas";

const Top10 = ({ data, title,timeframe }) => {
    const formatNumberWithCommas = useFormatNumberWithCommas();
    return (
        <Card className="p-4 ">
            {data ? (
                <>
                    {/* כותרת ראשית */}
                    <div className="flex justify-between items-center mb-4 pb-2 border-2 border-transparent border-b-lime ">
                        <h3 className="text-lg font-semibold text-titles">{title} This {timeframe}</h3>
                    </div>

                    {/* כותרות נתונים */}
                    <div className="grid grid-cols-3 pl-7 mb-2 font-bold text-titles">
                        <span>Name</span>
                        <span>Sales/Cost</span>
                        <span>Quantity</span>
                    </div>

                    {/* נתונים */}
                    <div className="w-full max-h-[270px] overflow-y-auto space-y-2">
                        {data.map((item, index) => (
                            <div className={`flex flex-row items-center justify-between border-2 border-secondary rounded-sm  border-l-lime`}>
                                <span className={`font-bold p-2`}>{index + 1} </span>
                                <div
                                    key={item.id}
                                    className="grid grid-cols-3 items-center bg-white p-2 w-full rounded-sm"
                                >
                                    <span className="text-lg font-semibold col-span-1">
                                       {item.dish || item.name}
                                    </span>
                                    <span className="text-md text-titles col-span-1 pl-5 ">
                                        {`${formatNumberWithCommas(item.totalSales) || formatNumberWithCommas(item.cost)} ₪`}
                                    </span>
                                    <span className="text-md  col-span-1 pl-7 ">{item.quantity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="text-lg text-center text-gray-500">No sales data available</div>
            )}
        </Card>
    );
};

export default Top10;
