
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../firebaseConfig';
import { doc, setDoc, WriteBatch, writeBatch } from "firebase/firestore";
import { toast } from 'react-toastify';
import menuSchema from '../../schemas/menuSchema';

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
                kosher: values.kosher,
                email: values.email,
                uid: userCredential.user.uid
            };
            const menuTemplate = {
                uid: userCredential.user.uid,
                menu:menuSchema,
            }

            const batch = writeBatch(db);

            const userRef = doc(db, "users", userCredential.user.uid);
            batch.set(userRef, userData);

            const menuRef = doc(db, "menus", userCredential.user.uid);
            batch.set(menuRef, menuTemplate);
            try {
                await batch.commit();
                console.log("User and menu documents successfully written!");
            } catch (error) {
                console.error("Error writing documents: ", error);
            }
            toast.success('Registration successful!');
        } catch (error) {
            throw error;
        }
    };

    return { handleRegister };
};
