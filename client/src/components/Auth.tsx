import React from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const Auth = () => {
    return (
        <div className="grid grid-cols-2">
            <div>
                <LoginForm className="overflow-y-auto transition-all ease-in blur-sm hover:filter-none place-content-center focus-within:filter-none"/>
            </div>
            <div>
                <SignupForm className="overflow-y-auto transition-all ease-in blur-sm hover:filter-none place-content-center focus-within:filter-none"/>
            </div>
        </div>
    )
}

export default Auth;