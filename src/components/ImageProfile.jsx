import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { storage } from '../firebase';
import { ref, uploadString} from 'firebase/storage';
import { UseAuth } from '../contexts/AuthContext';

export default function ImageProfile() {
    const imageRef = useRef()
    const [image, setImage] = useState()
    const [loading, setLoading] = useState(false)

    const { currentUser } = UseAuth()



    function showImage(e) {
        console.log(e)
        console.log(imageRef.current.value)
        const profileURI = fileToDataUri(e.target.files[0])
        profileURI.then((data) => {
            console.log(data)
            setImage(data);
        })
    }

    function fileToDataUri(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.readAsDataURL(file);
        });
    }


    function uploadProfile() {
        setLoading(true);
        if (image == null) return;
        const profileRef = ref(storage, currentUser.email)
        uploadString(profileRef, image, 'data_url').then((snapshot) => {
            console.log(snapshot)
            alert("Your profile has been uploaded!");
            setLoading(false)
            window.location = "/"
        });
        console.log(profileRef)
    }


    return (
        <Container>
            <CenterModule>
                {image && <img src={image}></img>}
                <Image ref={imageRef} type="file" accept="image/*" onChange={showImage}></Image>
                {!loading && <Submit onClick={() => { uploadProfile() }}>Submit</Submit>}
            </CenterModule>
        </Container>
    )
}

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #e0e0e0;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
`;

const CenterModule = styled.div`
    display: flex;
    flex-direction: column;
    img{
        width: 300px;
        aspect-ratio: 1/1;
    }
`;

const Image = styled.input`
`;

const Submit = styled.button`
    font-size: 1.2em;
    padding: 0.5em 1em;
`;