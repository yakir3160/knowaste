import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from "../Button/Button";
import Card from "../Card/Card";

const validationSchema = Yup.object({
    code: Yup.array()
        .of(
            Yup.string()
                .matches(/^[0-9]$/, 'Only digits are allowed')
                .required('Required')
        )
        .min(5, 'Code must be 5 digits')
        .max(5, 'Code must be 5 digits')
});

const VerificationCodeInput = () => {
    return (
        <Card>
            <Formik
                initialValues={{ code: ['', '', '', '', ''] }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const fullCode = values.code.join('');
                    console.log('Verification Code:', fullCode);
                }}
            >
                {({ values, handleChange, handleSubmit ,isSubmitting}) => (
                    <Form onSubmit={handleSubmit}>
                        <div className="flex justify-center  space-x-2 my-5">
                            {values.code.map((digit, index) => (
                                <div key={index}>
                                    <Field
                                        name={`code[${index}]`}
                                        type="text"
                                        maxLength="1"
                                        value={values.code[index]}
                                        onChange={handleChange}
                                        className="w-12 h-12 text-center shadow-inset-custom outline-none border-2 border-buttons rounded-[10px] text-xl  focus:border-2 focus:border-lime "
                                        onKeyDown={(e) => {
                                            if (e.key === 'Backspace' && values.code[index] === '' && e.target.previousSibling) {
                                                e.target.nextSibling.focus();
                                            }
                                        }}
                                    />
                                </div>
                            ))}
                            <ErrorMessage
                                component="div"
                                className="text-errorRed text-xs mt-1"
                                name={`error`}/>
                        </div>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full text-titles border-2 border-lime flex justify-center items-center`}>
                            {isSubmitting ? (
                                <>
                                    submitting...
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-titles ml-3"></div>
                                </>
                            ) : (
                                'Submit Code'
                            )}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default VerificationCodeInput;
