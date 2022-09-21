import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { firestore } from '../../../firebase';
import { getDocs, collection, query  } from 'firebase/firestore';


export default function Users() {
    const [userList, setUserList] = useState();

    useEffect(()=>{
        const userCollectionsRef = query(collection(firestore, 'users'));
        getDocs(userCollectionsRef).then((docs)=>{
            const toUserList = []
            docs.forEach((doc)=>{
                const data = doc.data();
                console.log(data);
                toUserList.push(
                    <UserInfo>
                        <h3>{data.name}</h3>
                    </UserInfo>
                )
            });
            setUserList(toUserList);
        })

    },[])

    return (
        <Container>
            {userList && userList}
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 1em;
    box-sizing: border-box;
    gap: 1em;
`;

const UserInfo = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0em 1.5em;
    background-color: white;
    border-radius: 10px;
    height: min-content;
`;
