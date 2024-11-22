import React from 'react';
import { useUserContext } from "../../../../contexts/UserContext";
import { useAuthContext } from "../../../../contexts/AuthContext";
import AdminPanelContainer from "../../AdminPanelContainer";
import PriceQuoteForm from './PriceQuoteForm';
import PriceQuoteList from './PriceQuoteList';
import { INVENTORY_ITEMS } from './mockData';

const PriceQuote = () => {
    const { userBaseData } = useUserContext();
    const { user } = useAuthContext();

    return (
        <AdminPanelContainer pageTitle={'Request Price Quote'} layout={`p-5 gap-10 grid grid-cols-1 lg:grid-cols-1`}>
            <PriceQuoteForm
                inventoryItems={INVENTORY_ITEMS}
                userData={{
                    uid: user?.uid,
                    email: user?.email,
                    businessId: userBaseData?.id,
                    businessName: userBaseData?.businessName
                }}
            />
            <PriceQuoteList
                userBaseData={userBaseData}
                userId={user?.uid}
            />
        </AdminPanelContainer>
    );
};

export default PriceQuote;
