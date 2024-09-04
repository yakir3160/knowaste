import React from 'react';
import '../css/Button.css';

const Button = ({ onClick, children, className,style, disabled }) => {
    return (
        <button
            onClick={onClick}
            style={style}
            className={`button ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};



export default Button;
