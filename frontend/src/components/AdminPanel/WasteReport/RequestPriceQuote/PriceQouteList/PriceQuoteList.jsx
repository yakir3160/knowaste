import React, { useState, useEffect } from 'react';
import { Download, Send, Edit, CircleX } from 'lucide-react';
import Card from "../../../../Common/Card/Card";
import Button from "../../../../Common/Button/Button";
import { getStatusColor } from '../PriceQuoteHelpers';
import { tableStyles } from '../../../../../css/tableStyles';
import { fetchUserQuotes, updateQuote, deleteQuote } from '../../../../../clientFunctions/priceQuoteFunctions';
import { QuoteListRow, LoadingRow, EmptyRow } from './QuoteListRow';

const PriceQuoteList = ({ userBaseData, userId, refreshTrigger = null }) => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdate = async (quoteId, updateData) => {
        await updateQuote(quoteId, updateData);
        const updatedQuotes = quotes.map(quote =>
            quote.id === quoteId ? { ...quote, ...updateData } : quote
        );
        setQuotes(updatedQuotes);
    };

    const handleDelete = async (quoteId) => {
        await deleteQuote(quoteId);
        setQuotes(quotes.filter(quote => quote.id !== quoteId));
    };

    const loadQuotes = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedQuotes = await fetchUserQuotes(userId);
            setQuotes(fetchedQuotes);
        } catch (err) {
            console.error('Error loading quotes:', err);
            setError('Failed to fetch quotes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuotes();
    }, [userId, refreshTrigger]);

    return (
        <Card className="bg-gray p-5 w-full h-full rounded-sm">
            <h1 className="text-2xl text-center mb-6">
                Price Quotes {userBaseData?.businessName ? `- ${userBaseData.businessName}` : ''}
            </h1>
            <div className="overflow-x-auto p-5 ">
                <table className="min-w-full ">
                    <thead>
                    <tr className="bg-secondary">
                        <th className={tableStyles.thClass}>Date</th>
                        <th className={tableStyles.thClass}>Items</th>
                        <th className={tableStyles.thClass}>Total</th>
                        <th className={tableStyles.thClass}>Status</th>
                        <th className={tableStyles.thClass}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <LoadingRow />
                    ) : quotes.length === 0 ? (
                        <EmptyRow />
                    ) : (
                        quotes.map((quote) => (
                            <QuoteListRow
                                key={quote.id}
                                quote={quote}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default PriceQuoteList;
