import React from "react";
import styled from "styled-components";
import { useRef } from "react";
import { UseAuth } from "../contexts/AuthContext";
import * as router from 'react-router-dom';
import { Navigate } from "react-router-dom";
import { useState } from "react";

const LogIn = (props) => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState();
    const { logIn, currentUser } = UseAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await logIn(emailRef.current.value, passwordRef.current.value);
        } catch (e) {
            setError(e.toString().split(":")[2]);
        }
    }

    return (
        <Container>
            {console.log(router)}
            {currentUser && <Navigate to="/"></Navigate>}
            <Card>
                <Form onSubmit={handleSubmit}>
                    {error && <Error>
                        {error}
                    </Error>}

                    <Info>
                        <Name >Email</Name>
                        <Input type='email' ref={emailRef} required></Input>
                    </Info>
                    <Info>
                        <Name >Password</Name>
                        <Input type='password' ref={passwordRef} required></Input>
                    </Info>
                    <Submit>Login</Submit>
                    <p>Dont have an account? <a href='/signup'>Sign Up</a></p>
                </Form>
            </Card>
        </Container>
    )
}


const Container = styled.div`
    
`;

const Error = styled.div`
    width: 80%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #e43a3a45;
    border-radius: 5px;
`;

const Card = styled.div`
    width: 300px;
    border-radius: 50px;
    background: #e0e0e0;
    box-shadow:  20px 20px 60px #bebebe,
                -20px -20px 60px #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 2em 1em;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
`;

const Info = styled.div`
    width: 150px;
`;

const Name = styled.div`
    margin-left: 2px;
    color: #0D5C63;
`;

const Input = styled.input`
    box-shadow: inset 4px 4px 8px #c5c5c5,
                inset -4px -4px 8px #fbfbfb;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-items: center;
    border: none;
    width: 100%;
    height: 25px;
    background-color: #FFFFFF49;
    border-radius: 5px;
`;

const Submit = styled.button`
    background-color: #FAB221;
    border: none;
    margin-top: 1em;
    font-size: 1.125em;
    padding: 10px 25px;
    border-radius: 7px;
`;

export default LogIn;