import * as Yup from 'yup';
import { REQUIRED_MSG } from "../../../constants/Constants";

const PASSWORD_MSG = 'Password must meet the conditions';

export const validationSchema = Yup.object().shape({
    businessName: Yup.string().required(REQUIRED_MSG),
    contactName: Yup.string().required(REQUIRED_MSG),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone number is not valid')
        .required(REQUIRED_MSG),
    address: Yup.string().required(REQUIRED_MSG),
    city: Yup.string().required(REQUIRED_MSG),
    zipCode: Yup.string().optional(),
    accountType: Yup.string().required(REQUIRED_MSG),
    email: Yup.string()
        .email('Invalid email address')
        .required(REQUIRED_MSG),
    password: Yup.string()
        .min(8, PASSWORD_MSG)
        .matches(/[A-Z]/, PASSWORD_MSG)
        .matches(/[a-z]/, PASSWORD_MSG)
        .matches(/[0-9]/, PASSWORD_MSG)
        .matches(/[@$!%*?&]/, PASSWORD_MSG)
        .required(REQUIRED_MSG),
    repeatPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required(REQUIRED_MSG),
});