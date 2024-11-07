import React from 'react';
import Card from '../../../Common/Card/Card';
import AdminPanelContainer from "../../AdminPanelContainer";


const RequestPriceQuote = () => {
    return (

        <AdminPanelContainer pageTitle={'Request Price Quote'} layout={`p-10 grid grid-cols-1 lg:grid-cols-2 `}>
            <Card className={`bg-gray p-5 h-full `}>
                <h1 className={`text-2xl text-center`} >Request Price Quote</h1>
            </Card>
            <Card className={`bg-gray p-5 h-full ml-4`}>
                <h1 className={`text-2xl text-center`}>Price Quotes</h1>
                <ul>
                    <li>Price Quote</li>
                    <li>Price Quote</li>
                    <li> Price Quote</li>
                    <li> Price Quote</li>
                </ul>
            </Card>
        </AdminPanelContainer>
    );
};

export default RequestPriceQuote;
