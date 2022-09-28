import React from 'react'
import { useEffect } from 'react';
import { UseAuth } from '../contexts/AuthContext'
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useRef } from 'react';

export default function DeletedAccount() {
    const passwordRef = useRef();
    const { currentUser } = UseAuth();

    useEffect(() => {
        if (!currentUser) {
            window.location = "/"
        }
    })

    function deleteUser() {
        console.log(currentUser)
        const credential = EmailAuthProvider.credential(currentUser.email, passwordRef.current.value)
        reauthenticateWithCredential(currentUser, credential).then((user) => {
            currentUser.delete().then((rs) => {
                window.location = "/"
            })
        })
    }

    return (
        <div>
            <h1>Your Account has been deleted</h1>
            <input ref={passwordRef} type="password" placeholder='password' />
            <button onClick={() => { deleteUser() }}>Delete Account and Go Back</button>
        </div>
    )
}
