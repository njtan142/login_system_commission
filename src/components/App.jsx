import React from "react";
import { Form, Card } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import SignUp from "./SignUp";



const App = (props) => {
    return (
        <AuthProvider>
            <React.Fragment>
                <SignUp></SignUp>
            </React.Fragment>
        </AuthProvider>

    )
}



export default App;