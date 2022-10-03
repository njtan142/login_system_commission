import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { firestore } from '../../../firebase';
import { getDocs, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { CSVLink, CSVDownload } from "react-csv";
// import { admin } from '../../../firebase';



export default function Users() {
    const [userList, setUserList] = useState();
    const [userInfo, setUserInfo] = useState();
    const [userLogins, setUserLogins] = useState();
    const [userUID, setUserUID] = useState();
    // const [csvData, setC]


    function showUserInfo(data) {
        getDocs(collection(doc(collection(firestore, 'users'), data.id), 'logins')).then((logins) => {
            const loginsList = logins.docs.map((doc) => { return doc.data() })
            setUserLogins(loginsList)
        })
        setUserInfo(data.data())
    }

    function deleteUser() {
        const user = doc(collection(firestore, 'users'), userUID.id)
        console.log(user)
        updateDoc(user, { deleted: true })
    }

    useEffect(() => {
        if (userInfo == null) return

    }, [])

    useEffect(() => {
        const userCollectionsRef = collection(firestore, 'users');
        getDocs(userCollectionsRef).then((docs) => {
            const toUserList = []
            docs.forEach((docu) => {
                const data = docu.data();
                console.log(data.deleted)
                if (data.deleted) return
                toUserList.push(
                    <tr key={data.name}>
                        <td>
                            {data.name}
                        </td>
                        <td>
                            {data.age}
                        </td>
                        <td>
                            {data.address}
                        </td>
                        <td>
                            <Timeline onClick={(e)=>{
                                showUserInfo(docu)
                                setUserLogins()
                            }}>
                               Download Logins
                            </Timeline>
                            
                        </td>
                        <td>
                            <button>Delete User</button>
                        </td>
                    </tr>
                )
            });
            setUserList(toUserList);
        })

    }, [])

    return (
        <Container>
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Age</td>
                        <td>Address</td>
                        <td>Logins</td>
                        <td>Manage</td>
                    </tr>
                </thead>
                <tbody>
                    {userList && userList}
                </tbody>
            </table>
            {
                userLogins && 
                    <CSVDownload filename={userInfo.name + '.csv'} data={userLogins} target="_self"/>
            }
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    box-sizing: border-box;
    gap: 1em;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
    width: 100%;
`;

const UserInfo = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0em 1.5em;
    background-color: white;
    border-radius: 10px;
    height: min-content;

    &:hover{
        background-color: #f0f0f0;
    }

    &:active{
        background-color: #A3A3A3;
    }
    
`;

const UserList = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 1em;
    box-sizing: border-box;
    gap: 1em;
`;

const UserInfos = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1em;
    box-sizing: border-box;
    background-color: #f1f1f1;
    height: 50vh;
    align-items: flex-start;
    gap: 10px   ;
    
    h2,h3{
        padding: 0px;
        margin: 0px;
    }
`;

const Timeline = styled.button`
    padding: 0.5em 1em;
    border: 1px solid gray;
    border-radius: 10px;
    &:hover{
        background-color: #DADADA;
    }

    &:active{
        background-color: #A3A3A3;
    }

    a{
        color: black;
        text-decoration: none;
    }
`;