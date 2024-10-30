
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';

export const useRegister = () => {

    const handleRegister = async (values) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const userData = {
                businessName: values.businessName,
                contactName: values.contactName,
                phone: values.phone,
                address: values.address,
                city: values.city,
                zipCode: values.zipCode,
                accountType: values.accountType,
                email: values.email,
                uid: userCredential.user.uid
            };
            await setDoc(doc(db, "users", userCredential.user.uid), userData);
            toast.success('Registration successful!');
        } catch (error) {
            throw error;
        }
    };

    return { handleRegister };
};
