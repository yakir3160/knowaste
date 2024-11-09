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
    const [error, setError] = useState(null);;

    // Check if both auth and user data are available
    const isFullyAuthenticated = Boolean(
        user?.uid &&
        userBaseData &&
        userBaseData.accountType === 'restaurant-manager'
    );

    useEffect(() => {
        console.log('Current userBaseData:', userBaseData);
        console.log('Current auth user:', user);
    }, [userBaseData, user]);


    useEffect(() => {
        if (user?.uid && userBaseData) {
            loadQuotes();
        }
    }, [user?.uid, userBaseData]);

    const loadQuotes = async () => {
        if (!user?.uid) {
            console.log('No user ID available for loading quotes');
            return;
        }

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

    const handleQuoteAdded = async () => {
        await loadQuotes();
    };

    if (!isFullyAuthenticated) {
        return (
            <AdminPanelContainer pageTitle={'Request Price Quote'} layout={`p-10`}>
                <Card className="flex justify-center items-center p-10 flex-col gap-4">
                    <div className="text-xl text-red-600">
                        {!user ? 'Please log in to access price quotes' :
                            !userBaseData ? 'Loading user data...' :
                                userBaseData.accountType !== 'restaurant-manager' ?
                                    'This feature is only available for restaurant managers' :
                                    'Authentication error'}
                    </div>
                </Card>
            </AdminPanelContainer>
        );
    }

    return (
        <AdminPanelContainer pageTitle={'Request Price Quote'} layout={`p-10 grid grid-cols-1 lg:grid-cols-2`}>
            <PriceQuoteForm
                inventoryItems={INVENTORY_ITEMS}
                onQuoteAdded={loadQuotes}
                userData={{
                    uid: user?.uid,
                    email: user?.email,
                    businessId: userBaseData?.id, // Adjust based on your actual data structure
                    businessName: userBaseData?.businessName
                }}
                isAuthenticated={isFullyAuthenticated}
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