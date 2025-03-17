import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { trackUserChanges } from "../FirebaseAuth/AuthMethods";
import { auth } from "../FirebaseAuth/firebase";
import { deleteUser,EmailAuthProvider, reauthenticateWithCredential, updateProfile, updateEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AlertButton from "./components/alertButton";
import './ProfileView.scss'

const ProfileView = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState(null);
    const [editStage, setEditStage] = useState('not-editable');
    const [isDeletingAccount, setDeletingAccount] = useState(false);
    const [pressedDelete, setPressedDelete] = useState(false);
    const [password, setPassword] = useState('');
    const [displaynameInput, setDisplaynameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [showReviews, setShowReviews] = useState(false);
    const [reviews, setReviews] = useState(null);

    const toggleDeletingAccount = () => {
        setDeletingAccount(!isDeletingAccount)
        setPressedDelete(false)
    }

    const toggleShowReviews = () => {
        setShowReviews(prevState => !prevState)
    }

    const retryReauthenticate = () => {
        const password = prompt("Re-authentication required. Please enter your password:");
        const credential = EmailAuthProvider.credential(user.email, password);
        reauthenticateWithCredential(user, credential).then(() => {
          // User re-authenticated, try updating email again
        }).catch((error) => {
          alert(`Re-authentication failed: ${error.message}`);
          retryReauthenticate(); // Retry re-authentication on failure
        });
      };

    const changeEditStage = () => {
        setDisplaynameInput('')
        setEmailInput('')
        if (editStage === 'not-editable') {
            setEditStage('editable')
            return
        }
        if (editStage === 'editable') {
            setEditStage('not-editable')
            return
        }
    }

    const handleSaveChanges = () => {

        if (isValidEdit(displaynameInput, user.displayName) && isValidEdit(emailInput, user.email)) {


        }

        if (isValidEdit(displaynameInput, user.displayName)) {
            if (displaynameInput && displaynameInput !== user?.displayName) {
                updateProfile(auth.currentUser, {
                    displayName: displaynameInput
                  }).then(() => {
                    // Profile updated!
                    // ...
                    setEditStage('not-editable')
                  }).catch((error) => {
                    // An error occurred
                    // ...
                  });
            }
            return
        }

        if (isValidEdit(emailInput, user.email)) {
            updateEmail(user, emailInput).then(() => {
                setEditStage('not-editable')
            }).catch((error) => {
                if (error.code === 'auth/requires-recent-login') {
                    retryReauthenticate();
                } else { 
                // An error occurred other than needing re-authentication 
                alert(error.message)
                }
            })
            return
        }

    }

    const handlePressedDelete = () => {
        setPressedDelete(true)
    }

    const handleDeleteAccount = () => {
        if (password) {
            const credential = EmailAuthProvider.credential(user?.email, password)

        reauthenticateWithCredential(user, credential).then(() => {
            // User re-authenticated.
            deleteUser(user).then(() => {
                // User deleted.
                navigate('/')
              }).catch((error) => {
                // An error ocurred
                // ...
                alert(error)
              });
          }).catch((error) => {
            // An error ocurred
            // ...
            alert(`${error.message}`)
          });
        } else {
            alert("Password is incorrect.")
        }
    }

    const isValidEdit = (input, checking) => {
        if (input && input !== checking) {
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = trackUserChanges(setUser);
    
        // Clean up subscription on unmount
        return () => unsubscribe();
      }, []);

    useEffect(() => {
        if (!user) return;
        fetch(`${process.env.REACT_APP_API_URL}/users/reviews/${user.uid}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json();
            })
            .then(reviewData => {
                setReviews(reviewData)

                })
                .catch(err => {
                    console.error("Error fetching reviews:", err)
                });
    }, [user])

    return (
        <div className="profile-page">
            <div className="header">
                <div className="title">
                    <h1>My Profile</h1>
                    <button onClick={changeEditStage}><CiEdit className="edit-button"/></button>
                </div>
            </div>
            <div className="content-container">
                <div className="column">
                <div className="user-info">
                <p className="label">Display Name</p>
                {editStage === 'not-editable' && (
                    <div className="not-editable">
                        <p>{user?.displayName}</p>
                    </div>
                )}
                {editStage === 'editable' && (
                    <input className="editable"
                    placeholder={user?.displayName}
                    type="text"
                    name="displayname"
                    value={displaynameInput}
                    onChange={(e) => setDisplaynameInput(e.target.value)}/>
                )}
            </div>
            <div className="user-info">
                <p className="label">Email</p>
                {editStage === 'not-editable' && (
                    <div className="not-editable">
                        <p>{user?.email}</p>
                    </div>
                )}
                {editStage === 'editable' && (
                    <input className="editable"
                    placeholder={user?.email}
                    type="email"
                    name="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}/>
                )}
            </div>
            {/*<div className="user-info">
                <p className="label">Phone Number</p>
                {editStage === 'not-editable' && (
                    <div className="not-editable">
                        <p>{user?.phoneNumber ?? 'No available Phone Number'}</p>
                    </div>
                )}
                {editStage === 'editable' && (
                    <input className="editable"
                    placeholder={user?.phoneNumber ?? 'Ex. 800-8135'}/>
                )}
            </div>*/}
                </div>
            
            <div className="column column2">
            <div className="centerer">
                <a href={`/auth/forgot-password?email=${user?.email}`} className="reset_password">I want to reset my password</a>
                <button onClick={toggleDeletingAccount}>
                    <p>Delete My Account</p>
                </button>
            </div>
            </div>
            </div>

            {editStage === 'editable' && (
                <div className="save-edits">
                <button className={`save-button ${(isValidEdit(displaynameInput, user.displayName) || isValidEdit(emailInput, user.email)) ? 'valid-edits' : 'invalid-edits'}`}
                onClick={handleSaveChanges}>
                    Save
                </button>
            </div>
            )
            }

            {isDeletingAccount && (
                <div className="delete-alert-container">
                    <div className="delete-placement">
                    <AlertButton
                        type="warning"
                        func={toggleDeletingAccount}
                        component={
                            <div className="place-in-front">
                                <p><strong>Warning:</strong> Are you sure your want to delete your account?</p>

                                {pressedDelete && (
                                    <div>
                                        <label>Enter Password:</label>
                                    <input 
                                    name="password" 
                                    type="text" 
                                    placeholder="MY_passw0rd!"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}/>
                                    <strong className="required-entry">*</strong>
                                </div>
                                )}

                                <div className="delete-buttons">
                                    {pressedDelete ? 
                                    <>
                                        <p onClick={() => setPressedDelete(false)} className="decision-button">CANCEL</p>
                                        <p onClick={handleDeleteAccount} className="decision-button">DELETE</p>
                                    </>
                                    :
                                    <>
                                        <p onClick={toggleDeletingAccount} className="decision-button">NO</p>
                                        <p onClick={handlePressedDelete} className="decision-button">YES</p>
                                    </>
                                    }
                        </div>
                    </div>
                }
                />
                </div>
                </div>
            )}
            <h2 className={`my-reviews ${showReviews ? 'showingReviews' : ''}`} onClick={toggleShowReviews}>My Reviews</h2>
            {showReviews && reviews && (
                reviews.map((review, index) => (
                    <div>
                        <p><span className='review-date'>{review.createdat_date}</span> <span>{review.createdat_time}</span></p>
                        <p className='tab'>{review.prefix} {review.code} - {review.title}: <span className='actual-review'>{review.body}</span></p>
                    </div>
                ))
            )}
        </div>
    )
}

export default ProfileView
