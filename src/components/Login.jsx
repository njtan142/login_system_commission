import React from "react";
import styled from "styled-components";

const LogIn = (props) => {
    return (
        <Container>
            <Card>
                <Info>
                    <Name>Email</Name>
                    <Input></Input>
                </Info>
                <Info>
                    <Name>Password</Name>
                    <Input></Input>
                </Info>
                <Submit>Login</Submit>
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 2em 1em;
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