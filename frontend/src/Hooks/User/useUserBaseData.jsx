import {useState,useEffect } from 'react'; // ייבוא רכיבי React
import {doc,getDoc ,updateDoc} from 'firebase/firestore'; // ייבוא רכיבים מהספרייה של Firebase
import {db} from '../../firebaseConfig'; // ייבוא קובץ firebase
import {useAuthContext} from "../../contexts/AuthContext";

export const useUserBaseData = () => {
    const [userBaseData, setUserBaseData] = useState(null); // יצירת משתנה חדש ופונקצית עדכון שתשמש לשמירת נתוני המשתמש
    const[loading, setLoading] = useState(true);
    const[success, setSuccess] = useState(false);
    const [error,setError ] = useState(null);
    const {user} = useAuthContext(); // שימוש בהקשר לנתוני המשתמש

    useEffect(() => {
        const getUserBaseData = async () => {
            if (user === null) {
                setLoading(false);
                setUserBaseData(null);
            } else {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const safeUserData = {
                            accountType: userDoc.data().accountType,
                            zipCode: userDoc.data().zipCode,
                            city: userDoc.data().city,
                            businessName: userDoc.data().businessName,
                            email: userDoc.data().email,
                            address: userDoc.data().address,
                            phone: userDoc.data().phone,
                            contactName: userDoc.data().contactName,
                        };
                        setUserBaseData(safeUserData);
                    } else {
                        setError('No such document!');
                    }
                } catch (error) {
                    setError('Error getting document: ' + error);
                } finally {
                    setLoading(false);
                }
            }
        };
        getUserBaseData();
    }, [user]);
    const updateUserDetails = async (newDetails) =>{
        try {
            setLoading(true)
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                await updateDoc(userDocRef, newDetails);
                setSuccess(true);
                setUserBaseData((prevData) => ({ ...prevData, ...newDetails }));
            } else {
                console.log('User document does not exist');
            }
        }catch (error) {
          switch (error.code) {
                case 'permission-denied':
                    setError('You do not have permission to update this document');
                    break;
                default:
                    setError('Error updating document: ' + error);
          }
        }finally {
            setLoading(false)
        }
    }

    return {userBaseData,updateUserDetails, loading, error,success,setSuccess};
}