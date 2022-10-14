import styled from "styled-components";
import { UseAuth } from "../../contexts/AuthContext";
import { useEffect, useRef } from "react";
import { useState } from "react";
import QRScanner from "./components/QRScanner";
import './home.css';
import Users from "./navigation-components/Users";
import Verify from "./navigation-components/Verify";
import { doc, collection, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";


const Home = (props) => {
    const [userList, setUserList] = useState();
    const [renderedUsers, setRenderedUsers] = useState();

    const { getUsers } = UseAuth();
    const usersNavRef = useRef();
    const verifyLoginNavRef = useRef();
    const [currentNavigationSelection, setCurrentNavigationSelection] = useState();
    const [currentNavigation, setCurrentNavigation] = useState();

    const {currentUser} = UseAuth();
    
    

    useEffect(() => {
        console.log(getUsers())
        let usersArr = [];
        getUsers().then(users => {
            users.forEach((doc) => {
                usersArr.push(doc.data())
            })
        }).then(()=>{
        console.log(usersArr)
        setUserList(usersArr)
        })
    }, [getUsers]);

    useEffect(()=>{
        function renderList(){
            const rows = []
            if(userList){
                userList.map((user)=>{
                    rows.push(
                        <div>{user.name}({user.age} yrs old)</div>
                    )
                })
            }
            setRenderedUsers(rows);
        }
        renderList();
    },[userList])
    
    useEffect(()=>{
        const adminAccessRef = doc(collection(firestore, 'admins'), currentUser.email)
        getDoc(adminAccessRef).then((data)=>{
            console.log(data.data());
            const access = data.data();
            if(access == undefined || access["permitted"] == undefined || access["permitted"] == false){
                console.log("Admin access denied");
                window.location = "/notAdmin"
            }
        })
    },[currentUser])


    function handleNavigationChange(ref){
        setCurrentNavigationSelection(ref);
        console.log(ref.current.innerText);
        switch(ref.current.innerText){
            case 'Users':
                setCurrentNavigation(<Users />);
                break;
            case 'Verify Login':
                setCurrentNavigation(<Verify />)
                break;
            default:
                return;
        }
    }

    useEffect(()=>{
        console.log("hello");
        console.log(currentNavigationSelection);
        if(currentNavigationSelection == null){return;}
        usersNavRef.current.classList.remove('selected');
        verifyLoginNavRef.current.classList.remove('selected');
        currentNavigationSelection.current.classList.add('selected');
    },[currentNavigationSelection])

    return (
        <Container> 
            <Navigation>
                <Title>Login System</Title>
                <Actions>
                    <Action ref={usersNavRef} onClick={()=> handleNavigationChange(usersNavRef)}>Users</Action>
                    <Action ref={verifyLoginNavRef} onClick={()=> handleNavigationChange(verifyLoginNavRef)}>Verify Login</Action>
                </Actions>
            </Navigation>
            {currentNavigation && currentNavigation}
        </Container>

    )
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: #e0e0e0;
    box-sizing: border-box;
    display: flex;
`;

const Navigation = styled.div`
    width: 25vw;
    background-color: white;
    height: 100%;
    box-sizing: border-box;
`;

const Title = styled.h1`
    text-align: center;
`;

const Actions = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: 0px 1em;
    gap: 1em;
`;
const Action = styled.button`
    background-color: transparent;
    border: none;
    border-radius: 10px;
    font-size: 1.5em;
    padding: 0.5em;
`;

const UserList = styled.div`
    overflow-y: scroll;
    border-radius: 11px;
    background: #e0e0e0;
    box-shadow: inset 7px 7px 14px #bebebe,
                inset -7px -7px 14px #ffffff;
    width: 50%;
    height: 50vh;
    margin: 0 auto;
    margin-top: 5em;
    padding: 1em 0.5em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;

    div{
        padding: 7px 1em;
        border: 1px solid #2261a8;
        min-width: 180px;
        border-radius: 10px;
    }
`;

const User = styled.div`
    display: flex;
    justify-content: space-between;
`;

export default Home