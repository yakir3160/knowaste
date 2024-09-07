import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Button.css';

const Button = ({ children, className, style, disabled, to, state }) => {
    return to ? (
        <Link
            to={to}
            state={state}
            className={`button ${className}`}
        >
            <button
                style={style}
                disabled={disabled}
            >
                {children}
            </button>
        </Link>
    ) : (
        <button
            style={style}
            className={`button ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
