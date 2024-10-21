import {useState,useEffect } from 'react'; // ייבוא רכיבי React
import {doc,getDoc } from 'firebase/firestore'; // ייבוא רכיבים מהספרייה של Firebase
import {db} from '../../firebaseConfig'; // ייבוא קובץ firebase
import {useAuthContext} from "../../Contexts/AuthContext";

export const useUserBaseData = () => {
    const  [userBaseData, setUserBaseData] = useState(null); // יצירת משתנה חדש ופונקצית עדכון שתשמש לשמירת נתוני המשתמש
    const[loading, setLoading] = useState(true); // יצירת משתנה חדש ופונקצית עדכון שתשמש לשמירת נתוני הטעינה
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
    }, [user, db]);

    return {userBaseData, loading, error};
}