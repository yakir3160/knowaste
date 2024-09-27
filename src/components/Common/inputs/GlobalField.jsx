import React from 'react';
import { Field, useField } from 'formik';
import { REQUIRED_MSG } from "../../../constants/Constants";

const GlobalField = ({
                         legend,
                         name,
                         as = 'input',
                         type = 'text',
                         placeholder,
                         options = [],
                         ...props
                     }) => {
    const [field, meta] = useField(name);
    const hasError = meta.touched && meta.error;
    const hasValue = field.value || (type === 'password' && field.value.length > 0);

    const getPlaceholder = () => {
        switch (type) {
            case 'email': return 'email@domain.com';
            case 'tel': return '05x-xxxxxxx';
            default: return placeholder;
        }
    };

    const fieldHeight = as === 'textarea' ? 'min-h-[100px]' : 'h-[55px]';
    const fieldClasses = `
    ${fieldHeight} p-3 w-full 
    shadow-inset-custom outline-none box-border
    focus:border-lime focus-visible:border-2 rounded-3xl
    transition-all duration-200
    ${hasError ? 'border-2 border-errorRed' : 'bg-inputs border-2 border-base'}
    ${as === 'textarea' ? 'resize-none' : ''}
  `;

    const legendClasses = `
     h-[0.5vh] pl-2 transition-all duration-200 text-gray text-md font-medium
    ${hasValue ? 'text-titles mt-0' : ''}
  `;

    return (
        <div className="relative flex flex-col min-w-[100px]">
            <legend className={legendClasses}>
                {legend}
            </legend>

            <div className="flex justify-center mt-5">
                {as === "select" ? (
                    <Field as="select" name={name} {...props} className={fieldClasses}>
                        {options.map(({ value, label }, index) => (
                            <option key={index} value={value}>{label}</option>
                        ))}
                    </Field>
                ) : (
                    <Field
                        name={name}
                        type={type}
                        as={as}
                        placeholder={getPlaceholder()}
                        {...props}
                        className={fieldClasses}
                    />
                )}
            </div>

            <div className="text-errorRed text-center min-h-[24px] text-sm w-full mt-2">
                {hasError && <div>{meta.error || REQUIRED_MSG}</div>}
            </div>
        </div>
    );
};

export default GlobalField;