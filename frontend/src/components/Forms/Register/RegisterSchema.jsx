import * as Yup from 'yup';
import { REQUIRED_MSG } from "../../../constants/Constants";
import {passwordSchema,repeatPasswordSchema} from "../../../validationSchemas/passwordSchema";


export const registerSchema = Yup.object().shape({
    businessName: Yup.string().required(REQUIRED_MSG),
    contactName: Yup.string().required(REQUIRED_MSG),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone number is not valid')
        .required(REQUIRED_MSG),
    email: Yup.string()
        .email('Invalid email address')
        .required(REQUIRED_MSG),
    password: passwordSchema,
    repeatPassword: repeatPasswordSchema,
});