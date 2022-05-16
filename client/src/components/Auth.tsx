import React from "react";
import { useNavigate } from "react-router-dom";
import EventList from "./EventDashboard";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const Auth = () => {
    const navigation = useNavigate();
    
    const userStat = (status: number) => {
        
        if(status === 200) {
            navigation("/eventDashBoard");
        }
    }
    return (
        <div className="grid grid-cols-2">
            <div>
                <LoginForm className="overflow-y-auto transition-all ease-in blur-sm hover:filter-none place-content-center focus-within:filter-none" userStatus = {userStat}/>
            </div>
            <div>
                <SignupForm className="overflow-y-auto transition-all ease-in blur-sm hover:filter-none place-content-center focus-within:filter-none" userStatus = {userStat}/>
            </div>
        </div>
    )
}

export default Auth;