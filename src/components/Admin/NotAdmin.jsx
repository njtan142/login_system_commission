import React from 'react'
import styled from 'styled-components'
import { UseAuth } from "../../contexts/AuthContext";
import { doc, collection, setDoc } from "firebase/firestore";
import { firestore } from "../../firebase";


export default function NotAdmin() {
    const {currentUser} = UseAuth();

    return (
        <Body>
            <Container>
                <Title>Access Denied</Title>
                <Info>You're not an admin</Info>
                <Actions>
                    <Request onClick={() => {
                        const adminAccessRef = doc(collection(firestore, 'admins'), currentUser.email)
                        setDoc(adminAccessRef, {permitted: null}).then(()=>{
                            alert("Request has been sent, please check again later");
                            window.location = "/"
                        });
                    }}>Request to be admin</Request>
                    <Understand href='/'>Go back</Understand>
                </Actions>
            </Container>
        </Body>
    )
}

const Body = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1em;
`;

const Title = styled.h1``;

const Info = styled.p``;

const Actions = styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    align-items: center;
`;

const Request = styled.button``;
const Understand = styled.a``;