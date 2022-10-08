import React from 'react'
import { useRef } from 'react';
import styled from 'styled-components';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase'
import { useState } from 'react';

export default function ForgotPassword() {
    const [result, setResult] = useState();
    const emailRef = useRef();


    return (
        <Container>
            <Form>
                {result && <p>{result}</p>}
                <input ref={emailRef} type="text" placeholder='email' />
                <button onClick={() => {
                    sendPasswordResetEmail(auth, emailRef.current.value.trim()).then(()=>{
                        setResult("Check your email, might be in the spam folders")
                    }).catch((e) => {
                        let result = e.toString().split("/")[1].split(")")[0].split("-").join(" ")
                        result = result.charAt(0).toUpperCase() + result.slice(1);
                        setResult(result)
                    });
                }}>Submit</button>
            </Form>
        </Container>
    )
}


const Container = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
`;

const Form = styled.div`
    width: 300px;
    padding: 1em;
    border: 1px solid gray;
    border-radius: 10px;
    p{
        text-align: center;
        font-size: 2em;
        width: 100%;
    }

`;