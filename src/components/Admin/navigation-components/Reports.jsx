import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import styled from 'styled-components'
import { firestore } from '../../../firebase';
import { getDocs, doc, collection, query } from 'firebase/firestore';

export default function Reports() {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState(" ");
    const [selectedUser, setSelectedUser] = useState([]);
    const [selectedUserData, setSelectedUserData] = useState({ total: 0 })
    const [toPrint, setToPrint] = useState();


    useEffect(() => {
        const usersRef = collection(firestore, 'users');
        getDocs(usersRef).then((users) => {
            const userList = []
            users.forEach((user) => {
                if (!user.data()['deleted']) {
                    userList.push({ id: user.id, name: user.data()['name'] })
                }
            })
            console.log(userList)
            setUsers(userList);
        })

    }, [])

    function onSelect(event) {
        const loginsRef = collection(doc(collection(firestore, 'users'), event.target.value.split("/")[0]), 'logins');
        console.log(event.target.innerHTML)
        setUserName(event.target.value.split("/")[1])
        getDocs(loginsRef).then((logins) => {
            const results = []
            const info = { total: 0, }
            logins.forEach((login) => {
                const data = login.data();
                const inHour = getHours(data.inAM);
                const outHour = getHours(data.outAM);
                const duration = outHour - inHour;
                info.total += duration;
                results.push({ date: data.date, time: data.inAM + " - " + data.outPM, duration: duration })
            })
            setSelectedUser(results)
            console.log(info);
            setSelectedUserData(info)
        })
    }

    function getHours(time) {
        if (time == null) return;
        time = time.split(":");
        const hour = parseInt(time[0])
        const minute = parseInt(time[1])
        const seconds = parseInt(time[2])
        return hour + (minute / 60) + (seconds / (60 * 60))
    }

    return (
        <Container>
            <Selection>
                <select name="users" id="usersSelection" onChange={onSelect}>
                    <option value="">Select User</option>
                    {
                        users.map((user) => {
                            return (
                                <option value={user.id + "/" + user.name}>{user.name}</option>
                            )
                        })
                    }
                </select>
            </Selection>
            <Logins>
                {
                    console.log(selectedUser)
                }
                <table>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Duration</th>
                    </tr>
                    {
                        selectedUser.map((user, index) => {
                            return (
                                <tr>
                                    <td>{index}</td>
                                    <td>{user.date}</td>
                                    <td>{user.time}</td>
                                    <td>{user.duration.toFixed(2) + " hrs"}</td>
                                </tr>
                            )
                        })
                    }
                    <tr>
                        <td>Total Rendered Time</td>
                        <td></td>
                        <td></td>
                        <td>{selectedUserData.total.toFixed(3) + " hrs"}</td>
                    </tr>
                </table>
            </Logins>
            <PrintButton onClick={()=>{setToPrint("sdfa")}}>Print</PrintButton>
            {
                toPrint &&
                <Print>
                    <table>
                        <tr>
                            <td>User:</td>
                            <td>{userName}</td>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Duration</th>
                        </tr>
                        {
                            selectedUser.map((user, index) => {
                                return (
                                    <tr>
                                        <td>{index}</td>
                                        <td>{user.date}</td>
                                        <td>{user.time}</td>
                                        <td>{user.duration.toFixed(2) + " hrs"}</td>
                                    </tr>
                                )
                            })
                        }
                        <tr>
                            <td>Total Rendered Time</td>
                            <td></td>
                            <td></td>
                            <td>{selectedUserData.total.toFixed(3) + " hrs"}</td>
                        </tr>
                    </table>
                </Print>
            }
        </Container>
    )
}

const PrintButton = styled.button`
    display: block;
    margin: 5em auto;
    padding: 0.5em 2em;
    font-size: 1.5em;
    background-color: white;
    border: none;
    border-radius: 15px;
    cursor: pointer;

    &:hover{
        background-color: #f3f3f3;
    }
`;

const Print = styled.div`
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    top: 0;
    left: 0;
    background-color: gray;
    padding: 3em;
    table{
        width: 80%;
        margin: auto;
        gap: 0px;
        border-spacing: 0px;
        background-color: white;
        padding: 3px;
        border-radius: 5px;
    }

    td, th{
        text-align: center;
        padding: 10px;
        background-color: white;
        /* border: 1px solid gray; */
    }
`;

const UserContainer = styled.div`
    display: flex;
`;

const Logins = styled.div`
    display: flex;
    flex-direction: column;

    table{
        width: 80%;
        margin: auto;
        gap: 0px;
        border-spacing: 0px;
        background-color: white;
        padding: 3px;
        border-radius: 5px;
    }

    td, th{
        text-align: center;
        padding: 10px;
        background-color: white;
        /* border: 1px solid gray; */
    }
    
    
`;

const Selection = styled.div`
    display: flex;
    justify-content: center;
    padding: 1em;

    select{
        padding: 0.5em;
        font-size: 1.1em;
    }
`;

const Container = styled.div`
    width: 100%;
    height: 100vh;
`;
