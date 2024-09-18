import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Button.css';

const Button = ({ children, className, style, disabled, to, state, onClick }) => {
    if (to) {
        return (
            <Link
                to={to}
                state={state}
                onClick={!disabled ? onClick : undefined}
                className={`button ${className}`}
                style={style}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            style={style}
            className={`button ${className}`}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
