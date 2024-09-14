import React from 'react';
import { Field, ErrorMessage } from 'formik';

const GlobalField = ({ legend, name,as, type = 'text', ...props }) => {
    // Determine the height based on the type
    const fieldHeight = as === 'textarea' ? 'h-[100px]' : 'h-[55px]';

    return (
        <fieldset className="w-[90%] mb-2 flex flex-col justify-center overflow-y-auto">
            {legend && <legend className="text-sm font-medium text-titles">{legend}</legend>}
            <Field
                name={name}
                type={type}
                {...props}
                className={`m-1 ${fieldHeight} p-3 block w-full shadow-inset-custom bg-baseLight outline-none resize-none box-border focus:border-lime focus-visible:border-1 focus-visible:border rounded-3xl placeholder:top-0 placeholder:pt-1`}
            />
            <div className="text-red-600 text-center min-h-[24px] text-sm w-full">
                <ErrorMessage name={name} component="div" className="text-red-600 min-h-[24px]" />
            </div>
        </fieldset>
    );
};

export default GlobalField;
