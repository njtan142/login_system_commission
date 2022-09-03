import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { UseAuth } from '../contexts/AuthContext';

export default function DashBoard() {
    const [data, setData] = useState();

    const { currentUser, getData, logOut } = UseAuth();

    useEffect(() => {
        if (currentUser) {
            const userData = getData();
            userData.then((document) => {
                setData(document.data());
            })
        }
    })

    if (currentUser) {
        return (
            <Container>
                <Left>
                    <Profile>
                        <div className="info">
                            User Information
                        </div>
                        <div className="img"></div>
                        <div className="infos">
                            <div>{data && data.name}</div>
                            <div>{data && data.age}</div>
                            <div>{data && data.address}</div>
                        </div>
                    </Profile>
                    <Functions>
                        <Logout onClick={logOut}>Logout</Logout>
                    </Functions>
                </Left>
                <Right>
                    <Timeline></Timeline>
                </Right>
            </Container>
        )
    }else{
       return <Navigate to="/login"></Navigate>
    }

}

const Container = styled.div`
    display: flex;
    height: 100vh;
    box-sizing: border-box;
`;

const Left = styled.div`
    width: 50vw;
`;

const Right = styled.div`
    width: 50vw;
`;

const Profile = styled.div`
    background-color: #ffffff45;
    border-top-right-radius: 20px;
    height: 50vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .img{
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: white;
    }

    .info{
        font-size: 2em;
    }

    .infos{
        display: flex;
        align-items: center;
        flex-direction: column;
        font-size: 1.5em;
        gap: 20px;
    }
`;

const Functions = styled.div`
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Logout = styled.button`
    font-size: 1.5em;
    padding: 0.2em 2em;
    border-radius: 10px;
    border: none;

    &:hover{
        background-color: white;
    }
    &:active{
        background-color: #c2c2c2;
    }
`;

const Timeline = styled.div`



`;


