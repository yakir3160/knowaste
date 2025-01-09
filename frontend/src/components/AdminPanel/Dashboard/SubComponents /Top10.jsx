import Card from "../../Common/Card/Card";
import React, {useEffect} from "react";
import {useAnalytics} from "../../../contexts/AnalyticsContext";


const Top10 = ({data,title}) => {
    return(

        <Card className=" p-4 bg-white ">
            {
                data.length > 0 ? (
                    <>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold  text-titles-color">Top {title}</h3>
                        </div>
                        <div className="w-full ">
                            {
                                data.map((dish,index) => (
                                    <div key={dish.id} className="flex justify-between items-center border-b border-secondary  bg-white p-2 rounded-[10px]">
                                        <span className="text-lg font-semibold">{index+1} - {dish.dish}</span>
                                        <span className="text-md text-successGreen">{dish.quantity} sold</span>
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