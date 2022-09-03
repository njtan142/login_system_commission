import React, { useContext, useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from "firebase/auth";



const AuthContext = React.createContext();


export function UseAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true);

    function signUp(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function logIn(email, password){
        return signInWithEmailAndPassword(auth, email, password)
    }

    async function logOut(){
        return signOut(auth);
    }

    async function getData(){
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        return userDoc;
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe
    })

    const value = {
        currentUser,
        signUp,
        logIn,
        getData,
        logOut,
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
