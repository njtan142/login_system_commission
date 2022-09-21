import React from 'react'
import styled from 'styled-components'
import QRScanner from '../components/QRScanner'

export default function Verify() {
    


    return (
        <Container>
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
`;

const Module = styled.div`
    background-color: white;
    border-radius: 15px;
    padding: 1em;
`;

const Result = styled.div`


`;