import { onAuthStateChanged, sendEmailVerification, createUserWithEmailAndPassword, signInWithEmailAndPassword, validatePassword, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

const getRandomSubstring = (str, length) => {
  const startIndex = Math.floor(Math.random() * (str.length - length + 1));
  return str.slice(startIndex, startIndex + length);
};

const trackUserChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in");
      callback(user); // Pass the user object to the callback
    } else {
      console.log("User is not logged in");
      callback(null); // Pass null if no user is logged in
    }
  });
};

const isAcceptableEmail = (email, callback) => {
    callback(email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
}

const verifyEmail = (user, callback) => {
    sendEmailVerification(user)
        .then(() => {
            // Email verification sent!
            callback(true)
        })
        .catch(() => {
            callback(false)
        });
}

const isAcceptablePassword = async (password, callback) => {
    const status = await validatePassword(auth, password);
    callback(status.isValid)

}

const createAccount = (email, password, callback) => {
    createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const display = `anon${getRandomSubstring(user.uid, 5)}`;
                updateProfile(user, {
                  displayName: display
                }).then(() => {
                  addDatabaseUser(user)
                  callback(user)
                })
                
            })
            .catch((error) => {
                //const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                callback(null)
            });
} 
const signInUser = async (email, password, callback) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        callback(user)
        // ...
      })
      .catch((error) => {
        //const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        callback(null)
      });
}

const signOutUser = (callback) => {
    signOut(auth).then(() => {
                callback(true)
              }).catch((error) => {
                callback(false)
              });
}

const isSignedIn = (callback) => {
    if (auth.currentUser) {
        callback(true)
    } else {
        callback(false)
    }
}

// db functions
const addDatabaseUser = (user) => {
  fetch(`${process.env.REACT_APP_API_URL}/users/add_user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // ADD SECRET KEY
      //'Aurthorization': token
    },
    body: JSON.stringify({
      id: user.uid,
      name: user.displayName,
      email: user.email
    })
  })
  .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error', error))
}


export { trackUserChanges, verifyEmail, isAcceptablePassword, createAccount, signInUser, signOutUser, isSignedIn, isAcceptableEmail };
