import { toast, ToastContainer } from 'react-toastify';
import {auth,db} from '../firebaseConfig'
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


export const useRegister = (navigate) => {

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {

            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            // הכנת אובייקט המידע למשתמש - ללא הסיסמה
            const userData = {
                businessName: values.businessName,
                contactName: values.contactName,
                phone: values.phone,
                address: values.address,
                city: values.city,
                zipCode: values.zipCode,
                accountType: values.accountType,
                email: values.email,
                uid: userCredential.user.uid  // שמירת ה-ID של המשתמש מ-Firebase Auth
            };
            console.log('Attempting to create user document in Firestore');
            await setDoc(doc(db, "users", userCredential.user.uid), userData);
            console.log('User document created successfully');
            toast.success('Registration successful!');
            navigate('/admin-panel')
            resetForm();

        } catch (error) {
            error.code === 'auth/email-already-in-use'
                ? navigate('/auth', {
                    state: {
                        showRegister: false,
                        email: values.email
                    }
                })
                : (() => {
                    toast.error('Registration failed. Please try again.');
                    console.error('Error during registration:', error);
                    console.error('Error code:', error.code);
                    console.error('Error message:', error.message);
                })();

        } finally {
            setSubmitting(false);
        }
    }
    return {handleSubmit}
};