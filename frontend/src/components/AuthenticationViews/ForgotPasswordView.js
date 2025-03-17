import React, { useEffect, useState } from "react";
import { auth } from "../FirebaseAuth/firebase";
import { sendPasswordResetEmail, confirmPasswordReset, updatePassword } from "firebase/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signInUser, signOutUser } from "../FirebaseAuth/AuthMethods";

const ForgotPasswordView = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [oobCode, setOobCode] = useState('');
    const [view, setView] = useState('email');

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleGotEmail = () => {
        setView('password-reset');
    };

    const handleResetPasswordWithOldPassword = (event) => {
        event.preventDefault();
        signInUser(email, oldPassword, (user) => {
            if (user) {
                updatePassword(user, newPassword);
                navigate('/')
            } else {
                alert('Could not sign in. Email or password must be incorrect.')
            }
        });
    };

    const handleChangePasswordWithEmail = (event) => {
        event.preventDefault();

        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log('Password reset email sent');
                alert(`Reset password link has been sent to ${email}`)
            })
            .catch((error) => {
                console.error('Error sending password reset email', error);
            });
    };

    const handleDontKnowOldPassword = () => {
        confirmPasswordReset(auth, oobCode, newPassword)
        
        signOutUser((result) => {
            if (result) {
                console.log('Password reset has been confirmed.')
                
            } else {
                alert("An error has occured changing password. Please try again.")
            }
        })

        navigate('/auth/new-password-signin')
    }

    useEffect(() => {
        const code = searchParams.get('oobCode') ?? null;

        const email_option = searchParams.get('email') ?? null

        if (email_option) {
            setEmail(email_option)
            setView('password-reset')
        }

        if (code) {
            setOobCode(code)
            setView('missing-old-password');
        }
    }, [searchParams]);

    const displayView = () => {
        switch (view) {
            case 'email':
                return (
                    <div className="auth-page">
                        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleGotEmail(); }}>
                            <h1>Account Email</h1>
                            <input
                                className="auth-item"
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button className="auth-item auth-submit" type="submit">
                                Submit
                            </button>
                        </form>
                    </div>
                );
            case 'password-reset':
                return (
                    <div className="auth-page">
                        <form className="auth-form" onSubmit={ handleResetPasswordWithOldPassword}>
                            <h1>Reset Password</h1>
                            <input
                                className="auth-item"
                                name="old-password"
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required
                            />
                            <input
                                className="auth-item"
                                name="new-password"
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button className="auth-item auth-submit" type="submit">
                                Submit
                            </button>
                            <p>or</p>
                            <p onClick={handleChangePasswordWithEmail}>Get email to change password</p>
                        </form>
                    </div>
                );
            case 'missing-old-password':
                return (
                    <div className="auth-page">
                        <form className="auth-form" onSubmit={handleDontKnowOldPassword }>
                            <h1>Enter New Password</h1>
                            <input
                                className="auth-item"
                                name="new-password"
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button className="auth-item auth-submit" type="submit">
                                Submit
                            </button>
                        </form>
                    </div>
                );
            default:
                return null;
        }
    };

    return displayView();
};

export default ForgotPasswordView;
