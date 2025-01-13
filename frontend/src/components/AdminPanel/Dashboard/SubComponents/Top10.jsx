import Card from "../../../Common/Card/Card";
import React, {useEffect} from "react";
import {useAnalytics} from "../../../../contexts/AnalyticsContext";


const Top10 = ({data,title}) => {
    return(
        <Card className=" p-4 bg-white ">
            {
                 data ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold  text-titles">{title}</h3>
                        </div>
                        <div className="w-full max-h-[300px] overflow-y-auto ">
                            {
                                data.map((dish,index) => (
                                    <div key={dish.id} className="flex justify-between items-center border-b border-secondary  bg-white p-2 rounded-[10px]">
                                        <span className="text-lg font-semibold">{index+1} - {dish.dish || dish.name}</span>
                                        <span></span>
                                        <span className="text-md text-successGreen">{dish.quantity}</span>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                ) : (
                    <div className="text-lg text-center text-gray-500">No sales data available</div>
                )
            }
        </Card>
    )
}
export default Top10;
