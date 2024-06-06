import React from 'react'
import Body from './Components/Body/Body.js'
import backgroundImage from "./Components/Body/BackgroundImage.svg";
import SignIn from "./Components/Authentication/SignIn.js";
import SignUp from "./Components/Authentication/SignUp.js";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Stack } from '@mui/material';
import Navbar from './Components/Navbar/Navbar.js'
import { useSelector } from 'react-redux';

const Main = () => {
    const { userId } = useSelector((state) => state.Chat)
    const loggedIn = userId !== '' ? true : false
    return (
        <>
            {loggedIn ? (
                <>
                    <Navbar />
                    <Stack spacing={'4px'} sx={{ backgroundImage: `url(${backgroundImage})`, height: '100%' }}>
                        <Router>
                            <Routes>
                                <Route path="*" element={<Body />} />
                            </Routes>
                        </Router>
                    </Stack>
                </>
            ) : (
                <Router>
                    <Routes>
                        <Route path="/" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Routes>
                </Router>
            )}
        </>
    )
}

export default Main
