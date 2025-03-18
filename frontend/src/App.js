// src/App.js
import React, { useEffect, useState, useRef } from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import HomeView from './components/HomeView/HomeView';
import ReviewsView from './components/ReviewsView/ReviewsView';
import SingleCourseReviewView from './components/ReviewsView/Sections/CourseReviewView/single_course/SingleCourseReviewView';
import CourseInsights from './components/ReviewsView/Sections/CourseReviewView/insights/CourseInsights';
import ShopView from './components/ShopView/ShopView';
import { IoPersonCircleSharp } from "react-icons/io5";
import { auth } from './components/FirebaseAuth/firebase';
import { trackUserChanges, signOutUser } from './components/FirebaseAuth/AuthMethods';
import ProfileView from './components/ProfileView/ProfileView';
import ForgotPasswordView from './components/AuthenticationViews/ForgotPasswordView';
import SignupAndSignin from './components/AuthenticationViews/SignupAndSignin';
import { verifyEmail } from './components/FirebaseAuth/AuthMethods';
import SignInView from './components/AuthenticationViews/SignIn';
import MessageView from './components/MessageView/MessageView'; 
import AboutView from './components/AboutView/AboutView';
import { Menu } from 'primereact/menu';
import 'primeicons/primeicons.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";


// Nav component
const Nav = () => {
  const [user, setUser] = useState(null)
  const [sentVerificationEmail, setSentVerificationEmail] = useState(false);
  const [selected, setSelected] = useState('');
  // initialize location and specify when to show nav
  const location = useLocation()
  const navigate = useNavigate()
  const showNavDisplay = !location.pathname.startsWith('/auth')
  const menuLeft = useRef(null);
  // const toast = useRef(null);

    const handleSignOut = () => {
        signOutUser((result) => {
            if (result) {
                navigate('/')
            } else {
                alert('There was an error signing out.')
            }
        })
    }
  
  const items_home = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-spin pi-cog',
                    command: () => {
                      navigate('my-profile')
                    }
                },     
                {
                    label: 'Messages',
                    icon: 'pi pi-inbox',
                    command: () => {
                      navigate('message')
                    }
                },
                {
                    className: 'profile-menu',
                    label: 'Sign Out',
                    icon: 'pi pi-sign-out',
                    command: () => {
                      handleSignOut()
                    }
                }
            ]
        }
    ];
  const items_profile = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Messages',
                    icon: 'pi pi-inbox',
                    command: () => {
                      navigate('message')
                    }
                },
                {
                    label: 'Home',
                    icon: 'pi pi-home',
                    command: () => {
                      navigate('/')
                    }
                },
                {
                    className: 'profile-menu',
                    label: 'Sign Out',
                    icon: 'pi pi-sign-out',
                    command: () => {
                      handleSignOut()
                    }
                }
            ]
        }
    ];
  const items_message = [
        {
            label: 'Options',
            items: [
                {
                    label: 'Settings',
                    icon: 'pi pi-spin pi-cog',
                    command: () => {
                      navigate('my-profile')
                    }
                },     
                {
                    label: 'Home',
                    icon: 'pi pi-home',
                    command: () => {
                      navigate('/')
                    }
                },
                {
                    className: 'profile-menu',
                    label: 'Sign Out',
                    icon: 'pi pi-sign-out',
                    command: () => {
                      handleSignOut()
                    }
                }
            ]
        }
    ];

  const handleSendVerificationEmail = () => {
    verifyEmail(auth.currentUser, (result) => {
      setSentVerificationEmail(result)
    })
  }

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = trackUserChanges(setUser);

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setSelected(location.pathname)
  }, [location])

  // nav component with navigation links
  return (
    <div className='nav-container'>
    {showNavDisplay ? (
      <div>
        {user && (
          !user.emailVerified && (
            <div className={`email-not-verified-notice ${sentVerificationEmail ? 'verification-sent' : ''}`}>
              {sentVerificationEmail ? 
                (
                  <p className='verification-text'>Verification email has been sent. Please check you email to verify.</p>
                )
                :
                (
                  <p className='verification-text'>You have not verified your email. Send verification link <b className='verify-email-button' onClick={handleSendVerificationEmail}>here</b></p>
              )}
            </div>
          )
        )}
        <div className={`nav ${user && !user.emailVerified ? 'email-not-verified-content' : ''}`}>
          <Link to={'/'} className='home-link'>
            <h3>StudentHub</h3>
          </Link>
          <div className='links'>
            {/*<Link to={'/'}>Home</Link>*/}
            <Link className={selected === '/shop' ? 'selected' : ''} to={'/shop'}>Shop</Link>
            <Link className={selected === '/reviews' ? 'selected' : ''} to={'/reviews'}>Reviews</Link>
            <Link className={selected === '/about' ? 'selected' : ''}  to={'/about'}>About</Link>
          </div>
          {user ? 
            <div className={`profile-link`} onClick={(event) => menuLeft.current.toggle(event)} aria-controls="popup_menu_left" aria-haspopup >
              <div className={`profile-icon ${selected === '/my-profile' ? 'selected' : ''}`}>
                <IoPersonCircleSharp />
                <Menu className='nav-menu' model={selected === '/my-profile' ? items_profile : selected === '/message'  ? items_message : items_home} popup ref={menuLeft} id="popup_menu_left" />
              </div>
            </div>
            :
            <Link className='profile-link' to={'/auth/signin'}>
              <div className='profile-text'>
                Sign In
              </div>
            </Link>
          }
        </div>
      </div>
    ) :
    (
      <div className='nav'>
          <Link to={'/'} className='home-link'>
            <h3>StudentHub</h3>
          </Link>
        </div>
    )}
    </div>
  )
}

// Main app component
// specifies all possible pages
const App = () => {
  const [courses, setCourses] = useState([]);
  const [shopPosts, setShopPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/shop_posts`)  // Replace with your new endpoint URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log("API URL:", process.env.REACT_APP_API_URL);
                return response.json();
            })
            .then(jsonData => {
                setShopPosts(jsonData);
                console.log(jsonData)
            })
            .catch(err => console.error("Error fetching data:", err));
            
    fetch(`${process.env.REACT_APP_API_URL}/courses`)  // Replace with your new endpoint URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log("API URL:", process.env.REACT_APP_API_URL);
                return response.json();
            })
            .then(jsonData => {
                setCourses(jsonData);
                console.log(jsonData)
            })
            .catch(err => console.error("Error fetching data:", err));
  }, [])
  
  
  return (
    <Router>
      <div className='container'>
        <Nav />
        <Routes>
          {/*Root*/}
          <Route path="/" element={<HomeView />} />

          {/*Shop Path*/}
          <Route path='/shop' element={<ShopView initialData={shopPosts} />} />

          {/*Review Paths*/} 
          <Route path="/reviews" element={<ReviewsView courseData={courses}/>} />
          <Route path="/reviews/courses/:course" element={<SingleCourseReviewView/>} />
          <Route path="/reviews/course-insights" element={<CourseInsights/>} />

          {/*About Path*/}
          <Route path="/about" element={<AboutView/>}/>

          {/*Authentication Paths*/}
          <Route path='/auth/signin' element={<SignupAndSignin />} />
          <Route path='/auth/forgot-password' element={<ForgotPasswordView />} />
          <Route path='/auth/forgot-password/__/auth/action' element={<ForgotPasswordView />} />
          <Route path='/auth/new-password-signin' element={<SignInView />} />

          {/*User Profile Paths*/}
          <Route path='/my-profile' element={<ProfileView />} />

          {/*Message View*/}
          <Route path='/message' element={<MessageView/>} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;
