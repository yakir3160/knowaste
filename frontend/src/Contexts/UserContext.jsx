import  React,{createContext,useContext,useState} from  'react';
import {useNavigate} from "react-router-dom";
import {useRegister } from "../GlobalHooks/useRegister";
// import {useLogin} from "../components/Forms/Login/Hooks/useLogin";
// import {useLogout} from "../components/Functions/Auth/useLogout";
import {auth} from "../firebaseConfig";
const UserContext = createContext();

export const UserProvider = ({children}) =>{
    const [user,setUser] = useState(null);
    const navigate = useNavigate();
    const {handleSubmit:registerUser} = useRegister(navigate);
    const register = async (values,setSubmitting,resetForm) =>{
        try {
            await registerUser(values,setSubmitting,resetForm);
            const user = auth.currentUser;
            setUser({ ...values, uid: auth.currentUser.uid });
        }catch (error){
            console.error('Error during registration:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
        }
    }
    return (
        <UserContext.Provider value={{user,register,setUser}}>
            {children}
        </UserContext.Provider>
    )
}
export const useUser = () => useContext(UserContext);