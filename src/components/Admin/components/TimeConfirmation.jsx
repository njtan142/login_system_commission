import React from 'react';
import { collection, doc, setDoc, onSnapshot, getDocs, query, orderBy, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase';
import { useEffect, useState } from 'react';
import { async } from '@firebase/util';
import styled from 'styled-components';
import { useRef } from 'react';


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
            await getDoc(doc(firestore, 'users', props.uid)).then((data) => {
                console.log(data.data());
                setName(data.data().name)
            })
        }
        getTimeData();

    }, [props.tid, props.uid])

    async function handleConfirmation(confirmed) {
        let timesCollectionsRef = doc(collection(doc(firestore, 'users', props.uid), 'logins'), props.tid)
        if (confirmed) {
            updateDoc(timesCollectionsRef, { verified: true }).then(()=>{
                alert("Login schedule confirmed!");
                window.location.reload();
            })
        } else {
            deleteDoc(timesCollectionsRef).then(()=>{
                alert("Login schedule denied so it will also be deleted");
                window.location.reload();
            })
        }
    }

    function getCurrentTime() {
        const d = new Date();
        let datetext = d.toTimeString();
        datetext = datetext.split(' ')[0];
        return datetext
    }

    async function time(timein, am) {
        let timesCollectionsRef = doc(collection(doc(firestore, 'users', props.uid), 'logins'), props.tid)
        if (timein) {
            if (am) {
                updateDoc(timesCollectionsRef, { inAM: getCurrentTime() })
            } else {
                updateDoc(timesCollectionsRef, { inPM: getCurrentTime() })
            }
        } else {
            if (am) {
                updateDoc(timesCollectionsRef, { outAM: getCurrentTime() })
            } else {
                updateDoc(timesCollectionsRef, { outPM: getCurrentTime() })
            }
        }
        await getDoc(timesCollectionsRef).then((data) => {
            console.log(data.data());
            setTimeData(data.data());
        })
    }

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
                <Action onClick={() => { handleConfirmation(true) }}>Accept</Action>
                <Action onClick={() => { handleConfirmation(false) }}>Deny</Action>
            </Actions>
        </Container>
    )
}

const Container = styled.div`

`;

const Infos = styled.div`
    
`;

const Actions = styled.div`
    padding: 0.25em;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
`;

const Action = styled.button``;