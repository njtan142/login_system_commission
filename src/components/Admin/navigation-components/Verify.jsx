import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import styled from 'styled-components'
import QRScanner from '../components/QRScanner'

export default function Verify() {

    const [date, setDate] = useState();
    const SECOND_MS = 1000;

    useEffect(() => {

    }, [setDate])

    useEffect(() => {
        const interval = setInterval(() => {
            const newDate = Date()
            setDate(newDate)
            console.log(newDate)
        }, SECOND_MS);

        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    return (
        <Container>
            <Title>OJT TIME MANAGEMENT SYSTEM</Title>
            <p>{date}</p>
            <Module>
                <QRScanner></QRScanner>
                <Result></Result>
            </Module>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

const Module = styled.div`
    background-color: white;
    border-radius: 15px;
    padding: 1em;
`;

const Title = styled.h1``;

const Result = styled.div`


`;