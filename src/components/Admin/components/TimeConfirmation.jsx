import React from 'react';
import { collection, doc, setDoc, onSnapshot, getDocs, query, orderBy, deleteDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useEffect, useState } from 'react';
import { async } from '@firebase/util';
import styled from 'styled-components';


export default function TimeConfirmation(props) {
    console.log(props)
    const [timeData, setTimeData] = useState();
    const [name, setName] = useState();

    useEffect(() => {
        async function getTimeData() {
            let timesCollectionsRef = doc(collection(doc(firestore, 'users', props.uid), 'logins'), props.tid)
            await getDoc(timesCollectionsRef).then((data) => {
                console.log(data.data());
                setTimeData(data.data());
            })
            await getDoc(doc(firestore, 'users', props.uid)).then((data)=>{
                console.log(data.data());
                setName(data.data().name)
            })
        }
        getTimeData();

    }, [props.tid, props.uid])

    if (timeData && name) return (
        <Container>
            <Infos>
                <h3>By: {name}</h3>
                <div>Date: {timeData.date}</div>
                <div>Time In Morning: {timeData.inAM}</div>
                <div>Time Out Morning: {timeData.outAM}</div>
                <div>Time In Afternoon: {timeData.inPM}</div>
                <div>Time Out Afternoon: {timeData.outPM}</div>
            </Infos>
            <Actions>
                <Action>Accept</Action>
                <Action>Deny</Action>
            </Actions>
        </Container>
    )
}

const Container = styled.div`

`;

const Infos = styled.div`
    
`;

const Actions = styled.div``;

const Action = styled.button``;