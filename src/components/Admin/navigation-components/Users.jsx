import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { firestore, storage } from '../../../firebase';
import { getDocs, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { CSVLink, CSVDownload } from "react-csv";
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { useRef } from 'react';
import { createRef } from 'react';



export default function Users() {
    const [userList, setUserList] = useState();
    const [userInfo, setUserInfo] = useState();
    const [userLogins, setUserLogins] = useState();
    const [profileImage, setProfileImage] = useState();
    const [selectedUser, setSelectedUser] = useState();
    const nameEditRef = useRef();
    const ageEditRef = useRef();
    const addressEditRef= useRef();
    const imageRefs = {}
    const imageSources = {}

    // const [csvData, setC]

    function getProfile(data) {
        console.log(data);
        const profileRef = ref(storage, data.id)
        getDownloadURL(profileRef).then((url) => {
            imageSources[data.data().name] = url;
            console.log(imageRefs[data.data().name].current.src);
            imageRefs[data.data().name].current.src = url;
            console.log(imageRefs[data.data().name].current.src);
        });
    }

    function showUserInfo(data) {
        getDocs(collection(doc(collection(firestore, 'users'), data.id), 'logins')).then((logins) => {
            const loginsList = logins.docs.map((doc) => { return doc.data() })
            setUserLogins(loginsList)
        })
        setUserInfo(data.data())
    }

    function deleteUser(userData) {
        const user = doc(collection(firestore, 'users'), userData.id)
        console.log(user)
        updateDoc(user, { deleted: true }).then(() => {
            window.location.reload();
        })
    }

    useEffect(() => {
        if (userInfo == null) return

    }, [])


    useEffect(() => {
        function load() {
            const userCollectionsRef = collection(firestore, 'users');
            getDocs(userCollectionsRef).then((docs) => {
                const toUserList = []
                docs.forEach((docu) => {
                    const data = docu.data();
                    console.log(docu)
                    if (data.deleted) return
                    const profileRef = createRef()
                    imageRefs[data.name] = profileRef;
                    console.log(imageRefs)
                    imageSources[data.name] = getProfile(docu)
                    toUserList.push(
                        <tr key={data.name}>
                            <td>
                                <img onClick={() => {
                                    const profileRef = ref(storage, docu.id)
                                    console.log(profileRef, docu.id);
                                    getDownloadURL(profileRef).then((url) => {
                                        setProfileImage(url);
                                    });
                                }} ref={imageRefs[data.name]} alt="" />
                            </td>
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
                                <Timeline onClick={(e) => {
                                    showUserInfo(docu)
                                    setUserLogins()
                                }}>
                                    Download Logins
                                </Timeline>

                            </td>
                            <td>
                                <button onClick={() => { deleteUser(docu) }}>Delete User</button>
                                <button onClick={() => {
                                    setSelectedUser(docu)
                                }}>Edit User</button>
                            </td>
                        </tr>
                    )
                });
                setUserList(toUserList);
            })
        }
        load();
        console.log(imageRefs, imageSources)
    }, [])


    useEffect(() => {

    }, [])

    return (
        <Container>
            <table>
                <thead>
                    <tr>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Address</th>
                        <th>Logins</th>
                        <th>Manage</th>
                    </tr>
                </thead>
                <tbody>
                    {userList && userList}
                </tbody>
            </table>
            {
                userLogins &&
                <CSVDownload filename={userInfo.name + '.csv'} data={userLogins} target="_self" />
            }

            {profileImage &&
                <ProfileView>
                    <ImageContainer>
                        <Close onClick={() => { setProfileImage(null) }}>X</Close>
                        <img src={profileImage} alt="" />
                    </ImageContainer>
                </ProfileView>
            }

            {
                selectedUser &&
                <ProfileEdit>
                    <FormContainer>
                        <h2>Edit Profile</h2>
                        <div><p>Name</p><input ref={nameEditRef} type="text" defaultValue={selectedUser.data().name} /></div>
                        <div><p>Age</p><input ref={ageEditRef} type="text" defaultValue={selectedUser.data().age} /></div>
                        <div><p>Address</p><input ref={addressEditRef} type="text" defaultValue={selectedUser.data().address} /></div>
                        <button onClick={()=>{
                            let data = {
                                name: nameEditRef.current.value,
                                age: ageEditRef.current.value,
                                address: addressEditRef.current.value
                            }
                            let userDataRef = doc(collection(firestore, 'users'), selectedUser.id);
                            updateDoc(userDataRef, data).then(()=>{
                                window.location.reload();
                            })
                        }}>Submit</button>
                    </FormContainer>
                </ProfileEdit>
            }


        </Container>
    )
}

const Container = styled.div`
    display: flex;
    box-sizing: border-box;
    gap: 1em;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 1em;


    & > table{
        width: 80%;
        background-color: #0000003e;
        border-spacing: 3px;
        padding: 5px;
        border-radius: 10px;
    }

    th, td {
        text-align: center;
        padding: 10px 15px;
        background-color: white;
        border-radius: 5px;
        border-spacing: 10px;
    }

    td > button {
        margin: 10px;
    }
    
    td > img{
        width: 50px;
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

const ProfileView = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #00000040;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ImageContainer = styled.div`
    width: 80%;
    height: 80%;
    background-color: white;
    border-radius: 20px;
    position: relative;
    img{
        width: 100%;
    }
`;

const Close = styled.button`
    position: absolute;
    top: -15px;
    right: -15px;
    font-size: 2.5em;
    font-weight: bold;
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 1px solid gray;
    color: red;
`;

const ProfileEdit = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #00000040;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const FormContainer = styled.div`
    width: 400px;
    height: max-content;
    background-color: white;
    border-radius: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    & > button{
        padding: 10px;
        margin: 15px;
        width: 200px;
    }
`;
