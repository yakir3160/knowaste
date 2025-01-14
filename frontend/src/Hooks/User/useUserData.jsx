import {useState } from 'react';
import {useAuthContext} from "../../context/AuthContext";

export const useUserData = () => {// יצירת משתנה חדש ופונקצית עדכון שתשמש לשמירת נתוני המשתמש
    const[loading, setLoading] = useState(false);
    const[success, setSuccess] = useState(false);
    const [userError,setUserError ] = useState(null);
    const {user,setUser} = useAuthContext(); // שימוש בהקשר לנתוני המשתמש

    const updateUserDetails = async (newDetails) =>{
        try {
            setLoading(true)
            const token = localStorage.getItem('authToken');
            const results =await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/update-profile`,{
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
            console.log(results)
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