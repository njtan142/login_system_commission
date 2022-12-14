import { async } from "@firebase/util";
import React from "react";
import { useRef } from "react";
import styled from "styled-components";
import { UseAuth } from "../contexts/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from '../firebase';
import { Navigate } from "react-router-dom";

const SignUp = (props) => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const nameRef = useRef();
    const ageRef = useRef();
    const addressRef = useRef();

    let uid;

    


    const { signUp, currentUser } = UseAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let result = await signUp(emailRef.current.value, passwordRef.current.value);
            await setDoc(doc(firestore, 'users', result.user.uid), {
                name: nameRef.current.value,
                age: ageRef.current.value,
                address: addressRef.current.value,
            });
        } catch (e) {
            console.log("error", e);
        }
    }

    if (!currentUser) {

    }
    return (
        <Container>
        {currentUser && <Navigate to="/"></Navigate>}
            <Card>
                <Form onSubmit={handleSubmit}>
                    <Info>
                        <Name>Name</Name>
                        <Input ref={nameRef} required></Input>
                    </Info>
                    <Info>
                        <Name>Age</Name>
                        <Input ref={ageRef} required></Input>
                    </Info>
                    <Info>
                        <Name>Address</Name>
                        <Input ref={addressRef} required></Input>
                    </Info>
                    <Info>
                        <Name >Email</Name>
                        <Input type='email' ref={emailRef} required></Input>
                    </Info>
                    <Info>
                        <Name >Password</Name>
                        <Input type='password' ref={passwordRef} required></Input>
                    </Info>
                    <Submit>Sign Up</Submit>
                    <p>Already have an account? <a href='/login'>Login</a></p>
                </Form>
            </Card>
        </Container>
    )
}


const Container = styled.div`
    
`;

const Card = styled.div`
    width: 300px;
    border-radius: 50px;
    background: #e0e0e0;
    box-shadow:  20px 20px 60px #bebebe,
                -20px -20px 60px #ffffff;
    
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

export default SignUp;