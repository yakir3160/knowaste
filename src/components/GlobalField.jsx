import React from 'react';
import { Field, useField } from 'formik';
import { REQUIRED_MSG } from '../constants';

const GlobalField = ({ legend, name, as, type = 'text', placeholder, options = [], ...props }) => {
    const fieldHeight = as === 'textarea' ? 'min-h-[100px]' : 'h-[55px]';
    const [field, meta] = useField(name);
    const hasError = meta.touched && meta.error;

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

    const fieldClasses = `
        ${fieldHeight} p-3 w-full 
       
        shadow-inset-custom outline-none box-border
        focus:border-lime focus-visible:border-2 rounded-3xl
        placeholder:top-0 placeholder:pt-1
        transition-all duration-200
        ${hasError ? 'bg-pink-100 border-2 border-red-500' : 'bg-baseLight border-2 border-base'}
    `;

    return (
        <div className="flex flex-col  min-w-[100px]  ">
            {legend && (
                <label className="text-sm font-medium text-titles mb-2">
                    {legend}
                </label>
            )}
            <div className="flex justify-center">
                {as === "select" ? (
                    <Field as="select" name={name} {...props} className={fieldClasses}>
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Field>
                ) : (
                    <Field
                        name={name}
                        type={type}
                        as={as}
                        placeholder={getPlaceholder()}
                        {...props}
                        className={`${fieldClasses} ${as === 'textarea' ? 'resize-none' : ''}`}
                    />
                )}
            </div>
            <div className="text-red-600 text-center min-h-[24px] text-sm w-full mt-2">
                {hasError && <div>{meta.error || REQUIRED_MSG}</div>}
            </div>
        </div>
    );
};

export default GlobalField;
