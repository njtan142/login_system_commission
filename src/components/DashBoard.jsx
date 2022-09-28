import { collection, doc, setDoc, onSnapshot, getDocs, query, orderBy, deleteDoc } from 'firebase/firestore';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { UseAuth } from '../contexts/AuthContext';
import { firestore, storage } from '../firebase';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import QRCode from "react-qr-code";
import ClockView from './ClockView';

export default function DashBoard() {
    const [data, setData] = useState();
    const [timeData, setTimeData] = useState();
    const [currentTimeData, setCurrentTimeData] = useState();
    const [renderRows, setRenderRows] = useState();
    const [loading, setLoading] = useState(false);
    const { currentUser, getData, logOut } = UseAuth();
    const [showQR, setShowQR] = useState(false);
    const [qr, setQR] = useState();
    const [profileImage, setProfileImage] = useState();

    useEffect(() => {
        async function getLogins() {
            let timesCollectionsRef = collection(doc(firestore, 'users', currentUser.uid), 'logins')
            timesCollectionsRef = query(timesCollectionsRef, orderBy('dateAdded'))
            let timesRef = await getDocs(timesCollectionsRef)
            let rows = []
            timesRef.forEach((doc) => {
                rows.push(doc.data())
            })
            console.log(rows)
            setTimeData(rows);
        }

        if (currentUser) {
            const userData = getData();
            userData.then((document) => {
                setData(document.data());
                if(document.data().deleted){
                    window.location = "/userDeleted"
                }
                getLogins();
            })
        }
    }, [])

    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    useEffect(() => {
        async function saveData() {
            let timesRef = collection(doc(firestore, 'users', currentUser.uid), 'logins');
            let timedocRef
            try {
                timedocRef = doc(timesRef, currentTimeData.id);
            } catch {
                return;
            }
            console.log(timedocRef);
            try {
                await setDoc(timedocRef, currentTimeData).then(() => {
                    console.log('he');
                })

            } catch (e) {
                console.log(e);
            }
        }

        if (renderRows) {
            try {
                saveData()
            } catch (e) {
            }
        }
    }, [renderRows, currentTimeData])


    useEffect(() => {
        if (timeData && currentTimeData != null) {
            const newDatas = timeData;
            newDatas.pop();
            newDatas.push(currentTimeData);
            setTimeData(newDatas);
        }
        if (timeData == null) return
        const rows = [];
        timeData.map((data, index) => {
            rows.push(
                <tr key={index}>
                    <td>{data.date}</td>
                    <td>{data.inAM}</td>
                    <td>{data.outAM}</td>
                    <td>{data.inPM}</td>
                    <td>{data.outPM}</td>
                    <td><button onClick={() => { deleteData(index, data.id) }}>x</button></td>
                    <td><button onClick={() => { openQR(currentUser.uid + "-" + data.id) }}>Show</button></td>
                    <Verified>{data.verified == null? "NO": data.verified? "YES": "NO"}</Verified>
                </tr>
            )
        })
        setRenderRows(rows)
    }, [currentTimeData, timeData]);


    function getCurrentDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        return today;
    }

    function getCurrentTime() {
        const d = new Date();
        let datetext = d.toTimeString();
        datetext = datetext.split(' ')[0];
        return datetext
    }

    function addRow() {
        const rows = timeData != null ? timeData : [];
        const rowData = {
            id: makeid(20),
            date: getCurrentDate(),
            inAM: null,
            outAM: null,
            inPM: null,
            outPM: null,
            dateAdded: Date.now(),
        }
        setCurrentTimeData(rowData);
        rows.push(rowData);
        setTimeData(rows);
        renderTable()
        console.log(timeData)
        return true
    }

    function timeIn() {
        renderTable()
        if (currentTimeData != null) {
            if (!checkRows()) {
                setCurrentTimeData(null);
                return;
            }
        } else {
            return
        }
        const data = currentTimeData
        if (data.date == null) data.date = getCurrentDate();
        if (data.inAM == null) {
            data.inAM = getCurrentTime();
        } else if (data.outAM != null && data.inPM == null) {
            data.inPM = getCurrentTime();
        }
        setCurrentTimeData(data);
        renderTable()
    }

    function timeOut() {
        if (currentTimeData != null) {
            if (!checkRows()) {
                setCurrentTimeData(null);
                return;
            }
        } else {
            return
        }
        const data = currentTimeData
        if (data.date == null) data.date = getCurrentDate();
        if (data.inAM != null && data.outAM == null) {
            data.outAM = getCurrentTime();
        } else if (data.inPM != null && data.outPM == null) {
            data.outPM = getCurrentTime();
        }
        setCurrentTimeData(data);
        renderTable()
    }

    async function deleteData(index, id) {
        await deleteDoc(doc(collection(doc(collection(firestore, 'users'), currentUser.uid), 'logins'), id)).then(() => { window.location.reload() });
    }

    function renderTable() {
        if (timeData == null) return
        const rows = [];
        timeData.map((data, index) => {
            rows.push(
                <tr key={index}>
                    <td>{data.date}</td>
                    <td>{data.inAM}</td>
                    <td>{data.outAM}</td>
                    <td>{data.inPM}</td>
                    <td>{data.outPM}</td>
                    <td><button onClick={() => { deleteData(index, data.id) }}>x</button></td>
                    <td><button onClick={() => { openQR(currentUser.uid + "-" + data.id) }}>Show</button></td>
                    <Verified>{data.verified == null? "NO": data.verified? "YES": "NO"}</Verified>
                </tr>
            )
        })
        setRenderRows(rows)
    }

    function checkRows() {
        if (!currentTimeData) return
        const notfull = Object.values(currentTimeData).some((value) => {
            if (value == null) return true
        })
        return notfull
    }

    function openQR(id) {
        setShowQR(true);
        setQR(id);
    }

    useEffect(() => {
        if (currentUser == null) return
        const profileRef = ref(storage, currentUser.email)
        getDownloadURL(profileRef).then((url) => {
            console.log(url);
            setProfileImage(url);
        });
    }, [currentUser])


    return (
        <Container>
            {!currentUser &&
                <Navigate to="/login"></Navigate>
            }
            <Left>
                <Profile>
                    <div className="info">
                        User Information
                    </div>
                    <div className="img" onClick={() => {
                        window.location = "/editProfile"
                    }}>
                        {profileImage && <img src={profileImage}></img>}
                    </div>
                    <div className="infos">
                        <div>{data && data.name}</div>
                        <div>{data && data.age}</div>
                        <div>{data && data.address}</div>
                    </div>

                </Profile>
                <ClockView></ClockView>
                <Functions>
                    <Button onClick={logOut}>Logout</Button>
                    <Button onClick={() => { timeIn() }}>Time In</Button>
                    <Button onClick={() => { timeOut() }}>Time Out</Button>
                    <Button onClick={() => { addRow() }}>New Date</Button>
                </Functions>
            </Left>
            <Right>
                <Timeline>
                    <Table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                                <th></th>
                                <th> ID </th>
                                <th>Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderRows}
                        </tbody>
                    </Table>
                    {showQR && <QRShow>
                        <QRContainer>
                            <QRCode value={qr} />
                            <QRHide onClick={() => { setShowQR(false) }}>Close</QRHide>
                        </QRContainer>
                    </QRShow>}
                </Timeline>
            </Right>
        </Container>
    )




}

const Container = styled.div`
    display: flex;
    height: 100vh;
    box-sizing: border-box;


    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const Left = styled.div`
    width: 20vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    @media (max-width: 768px) {
        width: 100vw;
        box-sizing: border-box;
        align-items: stretch;
        gap: 1em;
    }
`;

const Right = styled.div`
    width: 80vw;

    @media (max-width: 768px) {
        width: 100vw;
        box-sizing: border-box;
        min-height: 70vh;
        padding: 1em;

        table{
            width: 300px;
        }
    }
`;

const Profile = styled.div`
    background-color: #ffffff45;
    border-top-right-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    @media (max-width: 768px) {
        border-radius: 20px;
        padding: 3em;
        margin-top: 1em;
        .info{
            display: none;
        }

        .infos{
            align-items: flex-start !important;
        }

        .infos>div{
            font-size: 90%;
        }

        .img{
            width: 50px;
            height: 50px;
        }
    }

    .img{
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background-color: white;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .img:hover{
        cursor: pointer;
    }

    img{
        width: 100%;
        border-radius: 50%;
        box-sizing: border-box;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    justify-content: space-evenly;
    flex-grow: 1;

    @media (max-width: 768px) {
        box-sizing: border-box;
        gap: 10px;
    }
`;

const Button = styled.button`
    font-size: 150%;
    padding: 0.2em 1em;
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
    padding: 1em;


`;

const Table = styled.table`
    width: 80%;
    margin: 0 auto;
    border-collapse: collapse;

    th{
        font-size: 1.3em;
    }

    tr{
        border: 10px solid #e0e0e0;
        padding-left: 10px;
       
    }
    
    td{
        padding: 10px;
        border-radius: 4px;
        border-left: 10px solid #e0e0e0;
        background: #e0e0e0;
        box-shadow: inset 5px 5px 4px #cacaca,
                    inset -5px -5px 4px #f6f6f6;
        width: 50px;
       
    }
    button{
            display: block;
            margin: 0 auto;
            border-radius: 5px;
            border: 1px solid gray;
            padding: 5px 10px
        }
`;


const QRShow = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #0000006a;
`;

const QRContainer = styled.div`
    padding: 1em;
    background-color: #e0e0e0;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    gap: 0.5em;
    height: 350px;
`;

const QRHide = styled.button`
    padding: 1em;
    border: none;
    background-color: #62b6ff;
    height: 50px;
    border-radius: 10px;

    &:hover{
        border: 1px solid #1070c4;
    background-color: #41a6ff;

    }

    &:active{
    background-color: #35a1ff;

    }
`;

const Verified = styled.td`
    text-align: center;
`;