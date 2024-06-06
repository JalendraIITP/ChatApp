import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import Box from '@mui/material/Box';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import Profile from '../Pages/Profile';
import Friends from '../Pages/Friends';
import Notifications from '../Pages/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import UseContext from '../../context/UseContext';
import axios from 'axios';
import { authActions } from '../../ReduxToolkits/Store';
import { useDispatch } from 'react-redux';
export default function Navbar() {
    const dispatch = useDispatch();
    const { setIdMap } = React.useContext(UseContext);
    const [options, setOptions] = React.useState(undefined);
    const handleLogOut = async () => {
        try {
            const response = await axios.post('http://localhost:9000/logout', { withCredentials: true });
            setIdMap([]);
            console.log(response.message);
            dispatch(authActions.setUser(''));
            dispatch(authActions.changeFriend(''));
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <>
            <Box sx={
                {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'centre',
                    justifyContent: 'flex-end',
                    width: '100%',
                    height: '64px',
                }
            }>
                <Button
                    variant="plain"
                    color="neutral"
                    onClick={() => {
                        setOptions('addmember');
                    }}
                >
                    <PersonAddRoundedIcon />
                </Button>
                <Button
                    variant="plain"
                    color="neutral"
                    onClick={() => {
                        setOptions('notifications');
                    }}
                >
                    <NotificationsIcon />
                </Button>
                <Button
                    variant="plain"
                    color="neutral"
                    onClick={() => {
                        handleLogOut()
                    }}
                >
                    <LogoutIcon />
                </Button>
                <Button
                    variant="plain"
                    color="neutral"
                    onClick={() => {
                        setOptions('profile');
                    }}
                >
                    <AccountCircle />
                </Button>
            </Box >
            <Modal open={options} onClose={() => {
                setOptions(undefined)
            }} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>

                {options === 'profile' ? <Box sx={{
                    height: '70%', width: '60%'
                }}>
                    <Profile />
                </Box> : options === 'notifications' ? <Box sx={{
                    height: '500px',
                    width: '400px', display: 'flex', alignItems: 'centre', justifyContent: 'center',
                }}>
                    <Notifications />
                </Box> : options === 'addmember' ?
                    <Box sx={{
                        height: '500px',
                        width: '400px', display: 'flex', alignItems: 'centre', justifyContent: 'center',
                    }}>
                        <Friends />
                    </Box> : <h1></h1>}
            </Modal>
        </>
    );
}
