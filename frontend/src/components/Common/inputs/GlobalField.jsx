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
    const hasError = meta.touched && meta.error;
    const hasValue = field.value || (type === 'password' && field.value.length > 0);


    const togglePasswordVisibility = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const getPlaceholder = () => {
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
       ${fieldHeight} p-3 
        bg-white
        text-md
        shadow-inset-custom outline-none box-border
        focus:border-lime focus-visible:border-2 rounded-3xl
        transition-all duration-200
        ${hasError ? 'border-2 border-errorRed' : 'border-2 border-cards'}
        ${type === 'textarea' ? 'resize-none' : ''}
        ${type === 'password' && 'font-semibold'}
        ${disabled ? ' cursor-not-allowed opacity-50' : ''}
    `;

    const labelClasses = `
        h-[0.5vh] pl-2 transition-all duration-200 text-gray text-md font-medium
        ${hasValue ? 'text-titles mt-0' : ''}
        ${disabled ? 'opacity-75' : ''}
    `;

    return (
        <div className={`relative flex flex-col min-w-[100px] ${disabled ? 'opacity-95' : ''}`}>
            <label className={labelClasses}>
                {label}
            </label>

            <div className="flex justify-center mt-5">
                {(() => {
                    switch (type) {
                        case 'select':
                            return (
                                <Field
                                    as="select"
                                    name={name}
                                    disabled={disabled}
                                    {...props}
                                    className={fieldClasses}
                                >
                                    {options.map(({ value, label }, index) => (
                                        <option key={index} value={value}>{label}</option>
                                    ))}
                                </Field>
                            );
                        case 'textarea':
                            return (
                                <Field
                                    name={name}
                                    as="textarea"
                                    placeholder={getPlaceholder()}
                                    disabled={disabled}
                                    {...props}
                                    className={fieldClasses}
                                    autoFocus={autoFocus}
                                />
                            );
                        default:
                            return (
                                <>
                                    <Field
                                        name={name}
                                        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
                                        placeholder={getPlaceholder()}
                                        disabled={disabled}
                                        {...props}
                                        className={fieldClasses}
                                        autoFocus={autoFocus}
                                    />
                                    {type === 'password' && !disabled && (
                                        <span
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md hover:shadow-lg transition-shadow duration-200"
                                        >
                                            {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                                        </span>
                                    )}
                                </>
                            );
                    }
                })()}
            </div>

            <div className="text-errorRed text-center min-h-[20px] text-sm w-full">
                {hasError && <div>{meta.error || REQUIRED_MSG}</div>}
            </div>
        </div>
    );
};

export default GlobalField;