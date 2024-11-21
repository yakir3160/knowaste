import React from 'react';
import { Download, Send, Edit, CircleX } from 'lucide-react';
import Card from "../../../Common/Card/Card";
import Button from "../../../Common/Button/Button";
import { getStatusColor } from './PriceQuoteHelpers';
import {tableStyles } from './PriceQuoteHelpers';

const PriceQuoteList = ({ quotes, onQuoteUpdated, userBaseData, isLoading }) => {


    return (
        <Card className="bg-gray p-5 w-full h-full rounded-sm">
            <h1 className="text-2xl text-center mb-6">
                Price Quotes {userBaseData?.businessName ? `- ${userBaseData.businessName}` : ''}
            </h1>
            <div className=" overflow-x-auto     ">
                <table className="min-w-full">
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
                    {isLoading ? (
                        <tr>
                            <td colSpan="5" className={`${tableStyles.tableCellClass} text-center`}>
                                Loading quotes...
                            </td>
                        </tr>
                    ) : quotes.length === 0 ? (
                        <tr>
                            <td colSpan="5" className={`${tableStyles.tableCellClass} text-center text-gray-500`}>
                                No price quotes available
                            </td>
                        </tr>
                    ) : (
                        quotes.map((quote) => (
                            <tr key={quote.id}>
                                <td className={tableStyles.tableCellClass}>{quote.date}</td>
                                <td className={tableStyles.tableCellClass}>{quote.items}</td>
                                <td className={tableStyles.tableCellClass}>₪{quote.total?.toFixed(2)}</td>
                                <td className={tableStyles.tableCellClass}>
                                        <span className={`px-2 py-1 rounded-sm ${getStatusColor(quote.status)}`}>
                                            {quote.status}
                                        </span>
                                </td>
                                <td className={tableStyles.tableCellClass}>
                                    <Button
                                        className={tableStyles.buttonClass}
                                        onClick={() => {
                                            console.log('Download quote:', quote.id);
                                        }}
                                    >
                                        <Download size={20}/>
                                    </Button>
                                    {quote.status === 'Draft' && (
                                        <>
                                            <Button className={tableStyles.buttonClass}>
                                                <Send size={20}/>
                                            </Button>
                                            <Button className={tableStyles.buttonClass}>
                                                <Edit size={20}/>
                                            </Button>
                                            <Button className={tableStyles.buttonClass}>
                                                <CircleX size={20} className="text-errorRed"/>
                                            </Button>
                                        </>
                                    )}
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
