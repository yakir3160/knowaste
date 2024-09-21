import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Button.css';

const Button = ({ children, className = '', style = {}, disabled, to, state, onClick }) => {
    // Check if text color is already set in className or style
    const hasTextColor = className.includes('text-') || style.color;

    const combinedClassName = `button ${className} hover:text-buttons ${!hasTextColor ? 'text-titles' : ''}`;

    if (to) {
        return (
            <Link
                to={to}
                state={state}
                onClick={!disabled ? onClick : undefined}
                className={combinedClassName}
                style={style}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            className={combinedClassName}
            style={style}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
