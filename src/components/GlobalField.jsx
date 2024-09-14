import React from 'react';
import { Field, ErrorMessage, useField } from 'formik';

const GlobalField = ({ legend, name, as, type = 'text', placeholder, options = [], ...props }) => {
    // Determine the height based on the type
    const fieldHeight = as === 'textarea' ? 'h-[100px]' : 'h-[55px]';
    const [field, meta] = useField(name);
    const hasError = meta.touched && meta.error;

    // Set placeholder based on type
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
    return (
        <fieldset className="w-[100%] p-1 mb-1 mr-2 flex flex-col justify-center overflow-y-auto">
            {legend && <legend className="ml-2 text-sm font-medium text-titles">{legend}</legend>}
            {as === "select" ?
                <Field as="select" name={name} {...props}
                                      className={`m-1 ${fieldHeight} p-3 block w-full shadow-inset-custom bg-baseLight outline-none  box-border focus:border-lime focus-visible:border-1 focus-visible:border rounded-3xl 
                    ${hasError ? 'bg-pink-100 border-2 border-red-500' : 'bg-baseLight'}`}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Field> :
                <Field
                    name={name}
                    type={type}
                    as={as}
                    placeholder={getPlaceholder()}
                    {...props}
                    className={`m-1 ${fieldHeight} p-3 block w-full shadow-inset-custom bg-baseLight outline-none resize-none box-border focus:border-lime focus-visible:border-1 focus-visible:border rounded-3xl placeholder:top-0 placeholder:pt-1
                ${hasError ? 'bg-pink-100 border-2 border-red-500' : 'bg-baseLight'}`}
                />}

            <div className="text-red-600 text-center min-h-[24px] text-sm w-full">
                <ErrorMessage name={name} component="div" className="text-red-600 min-h-[24px]" />
            </div>
        </fieldset>
    );
};

export default GlobalField;
