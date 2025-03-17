import React, { useState } from "react";
import SignUpView from "./SignUp";
import SignInView from "./SignIn";

import './SignupAndSignin.scss';

const SignupAndSignin = () => {
    const [isSignup, setIsSignup] = useState(false)

    const toggleSignup = () => {
        setIsSignup(!isSignup)
    };
    
    return (
        <div className="signin-signup-page">
            <div className="fitting-div">
                <div className="cool-container">
                    { isSignup ? <SignUpView triggerIsSignup={toggleSignup} /> : <SignInView triggerIsSignup={toggleSignup}/>}
                </div>
            </div>
        </div>
    )
}

export default SignupAndSignin;
