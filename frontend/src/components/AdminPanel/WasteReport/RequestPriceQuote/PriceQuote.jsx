import React, {useState} from 'react';
import { useUserContext } from "../../../../contexts/UserContext";
import { useAuthContext } from "../../../../contexts/AuthContext";
import AdminPanelContainer from "../../AdminPanelContainer";
import PriceQuoteForm from './PriceQuoteForm';
import PriceQuoteList from './PriceQouteList/PriceQuoteList';
import { INVENTORY_ITEMS } from './mockData';

const PriceQuote = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { userBaseData } = useUserContext();
    const { user } = useAuthContext();
    const handleQuoteAdded = () => {
        setRefreshTrigger(prev => prev + 1);
    }
    return (
        <AdminPanelContainer pageTitle={'Request Price Quote'} layout={`p-2 gap-10 grid grid-cols-1 lg:grid-cols-1`}>
            <PriceQuoteForm
                inventoryItems={INVENTORY_ITEMS}
                onQuoteAdded={handleQuoteAdded}
                userData={{
                    uid: user?.uid,
                    email: user?.email,
                    businessId: userBaseData?.id,
                    businessName: userBaseData?.businessName
                }}
            />
            <PriceQuoteList
                refreshTrigger={refreshTrigger}
                userBaseData={userBaseData}
                userId={user?.uid}
            />
        </AdminPanelContainer>
    );
};

export default PriceQuote;
