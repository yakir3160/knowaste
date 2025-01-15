import React from 'react';
import Card from "../Common/Card/Card";

const TextCard = ({ icon: Icon, iconColor = '', title, text, className = '' }) => {
    return (
        <Card className={`flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow rounded-lg ${className}`}>
            <Icon className={`w-[48px] h-[48px] mb-[16px] ${iconColor}`} />
            <h4 className="text-[24px] p-4 font-semibold mb-[8px]">{title}</h4>
            <p className="text-[18px]  text-buttons text-center flex-grow">{text}</p>
        </Card>
    );
};

export default TextCard;
