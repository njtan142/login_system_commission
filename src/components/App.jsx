import React from "react";
import { Form, Card } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import SignUp from "./SignUp";
import DashBoard from "./DashBoard";
import LogIn from "./Login";
import Home from "./Admin/Home";
import ImageProfile from "./ImageProfile";
import DeletedAccount from "./DeletedAccount";
import ForgotPassword from "./ForgotPassword";



const App = (props) => {
    return (
        <React.Fragment>
            <Router>
                <AuthProvider>
                    <Routes>
                        <Route exact path="/" element={<DashBoard />} />
                        <Route exact path="/signup" element={<SignUp />} />
                        <Route exact path="/login" element={<LogIn />} />
                        <Route exact path="/admin" element={<Home />} />
                        <Route exact path="/editProfile" element={<ImageProfile />} />
                        <Route exact path="/userDeleted" element={<DeletedAccount />} />
                        <Route exact path="/forgotPassword" element={<ForgotPassword />} />
                    </Routes>
                </AuthProvider>
            </Router>
        </React.Fragment>
    )
}



export default App;