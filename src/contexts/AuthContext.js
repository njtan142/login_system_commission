import React, { useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";



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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setLoading(false);
            setCurrentUser(user);
        })

        return unsubscribe
    })

    const value = {
        currentUser,
        signUp
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
