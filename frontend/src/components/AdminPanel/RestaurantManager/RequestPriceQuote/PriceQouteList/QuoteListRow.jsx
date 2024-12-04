import React from 'react';
import { Download, Send, Edit, CircleX } from 'lucide-react';
import Button from "../../../../Common/Button/Button";
import { tableStyles } from '../../../../../css/tableStyles';
import { getStatusColor } from "../PriceQuoteHelpers";

const LoadingRow = () => (
    <tr>
        <td className={tableStyles.tableCellClass}>-</td>
        <td className={tableStyles.tableCellClass}>-</td>
        <td className={tableStyles.tableCellClass}>-</td>
        <td className={tableStyles.tableCellClass}>-</td>
        <td className={tableStyles.tableCellClass}>
            <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary"></div>
                <span>Loading...</span>
            </div>
        </td>
    </tr>
);

const EmptyRow = () => (
    <tr>
        <td className={tableStyles.tableCellClass}>-</td>
        <td className={tableStyles.tableCellClass}>-</td>
        <td className={tableStyles.tableCellClass}>-</td>
        <td className={tableStyles.tableCellClass}>-</td>
        <td className={tableStyles.tableCellClass}>
            <div className="text-center text-gray-500">
                <p>No quotes available</p>
            </div>
        </td>
    </tr>
);

const QuoteListRow = React.memo(({ quote, onUpdate, onDelete }) => {
    return (
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
                <div className="flex ">
                    <Button
                        className={tableStyles.buttonClass}
                        onClick={() => console.log('Download quote:', quote.id)}
                    >
                        <Download size={20}/>
                    </Button>
                    {quote.status === 'Draft' && (
                        <>
                            <Button
                                className={tableStyles.buttonClass}
                                onClick={() => onUpdate(quote.id, {status: 'Pending'})}
                            >
                                <Send size={20}/>
                            </Button>
                            <Button className={tableStyles.buttonClass}>
                                <Edit size={20}/>
                            </Button>
                            <Button
                                className={tableStyles.buttonClass}
                                onClick={() => onDelete(quote.id)}
                            >
                                <CircleX size={20} className="text-errorRed"/>
                            </Button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
});

export {QuoteListRow, LoadingRow, EmptyRow};
