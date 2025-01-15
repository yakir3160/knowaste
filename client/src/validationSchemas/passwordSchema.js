
import * as Yup from 'yup';

const PASSWORD_MSG = 'Password must meet the conditions';
const REQUIRED_MSG = 'This field is required';

export const passwordSchema = Yup.string()
    .min(8, PASSWORD_MSG)
    .matches(/[A-Z]/, PASSWORD_MSG)
    .matches(/[a-z]/, PASSWORD_MSG)
    .matches(/[0-9]/, PASSWORD_MSG)
    .matches(/[@$!%*?&]/, PASSWORD_MSG)
    .required(REQUIRED_MSG);

export const repeatPasswordSchema = Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required(REQUIRED_MSG);
