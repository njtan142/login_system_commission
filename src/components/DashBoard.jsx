import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { UseAuth } from '../contexts/AuthContext';

export default function DashBoard() {
    const [data, setData] = useState();
    const [timeData, setTimeData] = useState();
    const [currentTimeData, setCurrentTimeData] = useState();
    const [renderRows, setRenderRows] = useState();
    const { currentUser, getData, logOut } = UseAuth();

    useEffect(() => {
        if (currentUser) {
            const userData = getData();
            userData.then((document) => {
                setData(document.data());
            })
        }
    }, [])


    useEffect(() => {
        console.log('he')
        if (timeData && currentTimeData != null) {
            const newDatas = timeData;
            newDatas.pop();
            console.log(newDatas)
            newDatas.push(currentTimeData);
            setTimeData(newDatas);
        }
        renderTable()
    }, [currentTimeData]);


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
            date: null,
            inAM: null,
            outAM: null,
            inPM: null,
            outPM: null,
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

    function renderTable() {
        if (timeData == null) return
        const rows = [];
        timeData.map((data) => {
            rows.push(
                <tr>
                    <td>{data.date}</td>
                    <td>{data.inAM}</td>
                    <td>{data.outAM}</td>
                    <td>{data.inPM}</td>
                    <td>{data.outPM}</td>
                </tr>
            )
        })
        setRenderRows(rows)
    }

    function checkRows() {
        const notfull = Object.values(currentTimeData).some((value) => {
            if (value == null) return true
        })
        return notfull
    }

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
                    <Button onClick={logOut}>Logout</Button>
                    <Button onClick={() => { timeIn() }}>Time in</Button>
                    <Button onClick={() => { timeOut() }}>Time out</Button>
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
                            </tr>
                        </thead>
                        <tbody>
                            {renderRows}
                        </tbody>
                    </Table>
                </Timeline>
            </Right>
        </Container>
    )

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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3em;
`;

const Button = styled.button`
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

const Table = styled.table`
    border: 1px solid black;
    width: 100%;

    th, tr, td{
    border: 1px solid black;
    }
`;



