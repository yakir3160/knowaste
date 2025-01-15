import React, { useState } from 'react';
import { Field, useField } from 'formik';
import { REQUIRED_MSG } from "../../../constants/Constants";
import { Eye, EyeOff } from 'lucide-react';

const GlobalField = ({
                         label,
                         name,
                         type = 'text',
                         placeholder,
                         options = [],
                         disabled = false,
                         autoFocus = false,
                         className,
                         ...props
                     }) => {
    const [field, meta] = useField(name);
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [localValue, setLocalValue] = useState(field.value);
    const hasError = meta.touched && meta.error;
    const hasValue = field.value || (type === 'password' && field.value.length > 0);

    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const getPlaceholder = () => {
        if (!isFocused || !hasValue) {
            return '';
        }

        switch (type) {
            case 'email':
                return 'email@domain.com';
            case 'tel':
                return '05x-xxxxxxx';
            default:
                return placeholder;
        }
    };

    const fieldHeight = type === 'textarea' ? 'min-h-[100px]' : 'h-[55px]';
    const fieldClasses = `
        w-full
        ${fieldHeight} 
        p-3 
        bg-white
        text-md
        outline-none 
        box-border
        focus:border-lime 
        focus-visible:border-2 
        rounded-3xl
        transition-all 
        duration-200
        ${hasError ? 'border-2 border-errorRed' : 'border-2 border-secondary'}
        ${type === 'textarea' ? 'resize-none' : ''}
        ${type === 'password' && 'font-semibold'}
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${type === 'select' && 'appearance-none'}   
    `;

    const labelClasses = `
        absolute 
        transition-all 
        duration-200 
        text-md
        pointer-events-none
        ${(isFocused || hasValue || type === 'select' || type === 'date')
        ? '-top-6 left-2 text-titles'
        : 'top-4 left-4 text-gray'}
        ${disabled ? 'opacity-75' : ''}
    `;

    const handleFocus = () => {
        setIsFocused(true);
        if (type === 'number') {
            setLocalValue('');
            field.onChange({ target: { name, value: '' } });
        }
    };

    const handleBlur = (e) => {
        setIsFocused(false);
        if (type === 'number' && !e.target.value && localValue) {
            field.onChange({ target: { name, value: localValue } });
        }
        field.onBlur(e);
    };

    const handleChange = (e) => {
        if (type === 'number') {
            setLocalValue(e.target.value);
        }
        field.onChange(e);
    };

    return (
        <div className={`relative flex flex-col min-w-[100px] ${disabled ? 'opacity-95' : ''}`}>

            <div className="relative pt-6">
                {(() => {
                    switch (type) {
                        case 'select':
                            return (
                                <div className="relative">
                                    <label className={labelClasses}>
                                        {label}
                                    </label>
                                    <Field
                                        as="select"
                                        name={name}
                                        disabled={disabled}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        {...props}
                                        className={fieldClasses}
                                    >
                                        {options.map(({value, label}, index) => (
                                            <option key={index} value={value}>{label}</option>
                                        ))}
                                    </Field>
                                    <div
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2"
                                                  strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                </div>
                            );
                        case 'textarea':
                            return (
                                <div className="relative">
                                    <label className={labelClasses}>
                                        {label}
                                    </label>
                                    <Field
                                        name={name}
                                        as="textarea"
                                        placeholder={getPlaceholder()}
                                        disabled={disabled}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        {...props}
                                        className={fieldClasses}
                                        autoFocus={autoFocus}
                                    />
                                </div>
                            );
                        default:
                            return (
                                <div className="relative">
                                    <label className={labelClasses}>
                                        {label}
                                    </label>
                                    <Field
                                        name={name}
                                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                                        placeholder={getPlaceholder()}
                                        disabled={disabled}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={type === 'number' ? localValue : undefined}
                                        {...props}
                                        className={fieldClasses}
                                        autoFocus={autoFocus}
                                    />
                                    {type === 'password' && !disabled && (
                                        <span
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow duration-200"
                                        >
                                            {showPassword ? <Eye size={24}/> : <EyeOff size={24}/>}
                                        </span>
                                    )}
                                </div>
                            );
                    }
                })()}
            </div>
            <div className="text-errorRed text-center text-sm w-full   ">
                {hasError && <div>{meta.error || REQUIRED_MSG}</div>}
            </div>
        </div>
    );
};

export default GlobalField;