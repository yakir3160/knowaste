import React, { useState, useEffect } from 'react';
import { useUserContext } from "../../../../contexts/UserContext";
import { useAuthContext } from "../../../../contexts/AuthContext";
import Card from "../../../Common/Card/Card";
import Button from "../../../Common/Button/Button";
import AdminPanelContainer from "../../AdminPanelContainer";
import PriceQuoteForm from './PriceQuoteForm';
import PriceQuoteList from './PriceQuoteList';
import { fetchUserQuotes } from '../../../../clientFunctions/priceQuoteFunctions';
import { INVENTORY_ITEMS } from './mockData';

const PriceQuote = () => {
    const { userBaseData } = useUserContext();
    const { user } = useAuthContext();
    const [priceQuotes, setPriceQuotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    const loadQuotes = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Loading quotes for user:', user.uid);
            const quotes = await fetchUserQuotes(user.uid); // Use auth user ID here
            setPriceQuotes(quotes);
        } catch (err) {
            console.error('Error loading quotes:', err);
            setError('Failed to fetch quotes');
        } finally {
            setLoading(false);
        }
    };
     useEffect(() => {
         loadQuotes()
     },[])
    return (
        <AdminPanelContainer pageTitle={'Request Price Quote'} layout={`p-5 gap-10 grid grid-cols-1 lg:grid-cols-1`}>
            <PriceQuoteForm
                inventoryItems={INVENTORY_ITEMS}
                onQuoteAdded={loadQuotes}
                userData={{
                    uid: user?.uid,
                    email: user?.email,
                    businessId: userBaseData?.id, // Adjust based on your actual data structure
                    businessName: userBaseData?.businessName
                }}
            />
            <PriceQuoteList
                quotes={priceQuotes}
                isLoading={loading}
                error={error}
                onRetry={loadQuotes}
            />
        </AdminPanelContainer>
    );
};

export default PriceQuote;