import {useState,useEffect } from 'react'; // ייבוא רכיבי React
import {doc,getDoc ,updateDoc} from 'firebase/firestore'; // ייבוא רכיבים מהספרייה של Firebase
import {db} from '../../firebaseConfig'; // ייבוא קובץ firebase
import {useAuthContext} from "../../contexts/AuthContext";

export const useUserData = () => {// יצירת משתנה חדש ופונקצית עדכון שתשמש לשמירת נתוני המשתמש
    const[loading, setLoading] = useState(false);
    const[success, setSuccess] = useState(false);
    const [userError,setUserError ] = useState(null);
    const {user,setUser} = useAuthContext(); // שימוש בהקשר לנתוני המשתמש

    const updateUserDetails = async (newDetails) =>{
        try {
            setLoading(true)
            const token = localStorage.getItem('authToken');
            const results =await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/user/update-profile`,{
                method: 'PUT',
                headers: {
                    authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
                ,body: JSON.stringify({
                    userId: user.id,
                    newDetails
                })
            })
            setSuccess(true);
            setUser((prevData) => ({ ...prevData, ...newDetails }));
        }catch (error) {
            setUserError('Error updating document: ' + error);
        }finally {
            setLoading(false)
        }
    };
    return {updateUserDetails, loading, userError,setUserError,success,setSuccess};
}