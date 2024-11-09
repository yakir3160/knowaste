import React from 'react';
import { Download } from 'lucide-react';
import Card from "../../../Common/Card/Card";
import Button from "../../../Common/Button/Button";
import { getStatusColor } from './PriceQuoteHelpers';


    const PriceQuoteList = ({ quotes, onQuoteUpdated, userBaseData, isLoading }) => {
        return (
            <Card className={`bg-gray p-5 h-full ml-4`}>
                <h1 className={`text-2xl text-center mb-6`}>
                    Price Quotes {userBaseData?.businessName ? `- ${userBaseData.businessName}` : ''}
                </h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                        <tr className="bg-secondary">
                            <th className="border p-2 text-left">Date</th>
                            <th className="border p-2 text-left">Items</th>
                            <th className="border p-2 text-left">Total</th>
                            <th className="border p-2 text-left">Status</th>
                            <th className="border p-2 text-left">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="border p-4 text-center">
                                    Loading quotes...
                                </td>
                            </tr>
                        ) : quotes.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="border p-4 text-center text-gray-500">
                                    No price quotes available
                                </td>
                            </tr>
                        ) : (
                            quotes.map((quote) => (
                                <tr key={quote.id}>
                                    <td className="border p-2">{quote.date}</td>
                                    <td className="border p-2">{quote.items}</td>
                                    <td className="border p-2">₪{quote.total?.toFixed(2)}</td>
                                    <td className="border p-2">
                                        <span className={`px-2 py-1 rounded ${getStatusColor(quote.status)}`}>
                                            {quote.status}
                                        </span>
                                    </td>
                                    <td className="border p-2">
                                        <Button
                                            className="p-1"
                                            onClick={() => {
                                                console.log('Download quote:', quote.id);
                                            }}
                                        >
                                            <Download size={20} />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </Card>
        );
    };


    export default PriceQuoteList;