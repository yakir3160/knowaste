import React from 'react';
import Logo from '../../../Common/Logo/Logo';
import Button from '../../../Common/Button/Button';
import {useAuthContext} from "../../../../contexts/AuthContext";
import {CircleUserRound} from 'lucide-react'
import {useUserContext} from "../../../../contexts/UserContext";
import Loading from "../../../Common/Loading/Loading";

const DesktopNavbar = () => {
    const {userBaseData,loadingData} = useUserContext();
    return (
        <>

            <div className=" w-[100%] sm:flex flex-row lg:gap-5  justify-between pr-5 lg:px-20 px-10 ">
                <Logo className={`text-logo-md sm:text-logo-sm md:text-logo-md lg:text-logo-lg `}/>
                <div className="flex space-x-2 rounded-b-sm px-3 bg-secondary h-fit py-4">
                    <Button className={`bg-base`} to="/contact">Contact Us</Button>
                    { loadingData ?
                        <Button className={`border-2 border-lime text-titles flex justify-center`}><CircleUserRound className={`animate-spin`}/></Button>
                        :
                        (  userBaseData    ?
                                (
                                    <Button to="/admin-panel"
                                            className="border-2 border-lime text-titles flex justify-center ">
                                        <CircleUserRound className={`mr-2`}/>
                                        {userBaseData?.businessName}
                                    </Button>)
                                : (
                                    <Button to="/auth" state={{showRegister: false}} className="bg-lime">Login</Button>
                                )
                        )
                    }
                </div>
            </div>
        </>
    );
};
export default DesktopNavbar;
