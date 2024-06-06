import Heading from './Heading';
import { useSelector } from 'react-redux';
import { Stack, TextField, IconButton } from '@mui/material';
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded';
import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';
import { useEffect, useState, useContext } from 'react';
import UseContext from '../../context/UseContext';
import SendIcon from '@mui/icons-material/Send';
import Conversation from './Conversation';
import axios from 'axios';
import RightBGI from './RightBGI.svg'

import io from 'socket.io-client'
const ENDPOINT = "http://localhost:9000";
var socket, selectedChatCompare;

const BodyRight = () => {
    const { update, setUpdate } = useContext(UseContext);
    const [message, setMessage] = useState('');
    const { userId, friendId } = useSelector((state) => state.Chat)
    const [data, setData] = useState([]);
    const [socketConnection, setSocketConnection] = useState(false)
    // Message Showing
    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:9000/getconversations', { friendsId: friendId }, { withCredentials: true });
            setData(response.data)
            setUpdate(!update);
            socket.emit('join chat', friendId)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit('setup', data);
        socket.on('connection', () => setSocketConnection(true))
    }, [])

    useEffect(() => {
        fetchData()
        selectedChatCompare = data
    }, [friendId])

    useEffect(() => {
        socket.on("Message received", (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived._id) {

            } else {
                setData([...data, newMessageReceived])
            }
        })
    })
    // Message Typing
    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/addmessage', { sender: userId, receiver: friendId, message: message }, { withCredentials: true })
            socket.emit('newmessage', response.data)
            setUpdate(!update);
            fetchData()
        } catch (e) {
            console.log(e)
        }
    };
    const handleMessage = (e) => {
        setMessage(e.target.value);
    };
    return (
        <>
            {friendId !== '' ? <Stack sx={{ width: '75%', backgroundColor: 'gray', borderRadius: '5px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Heading sx={{ alignSelf: 'flex-start' }} />
                <Stack spacing={1} padding={'5px'} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    height: '100%',
                    overflow: 'auto',
                    padding: '5px'
                }}>
                    {data.slice().reverse().map((item, index) => (
                        <Conversation data={item} />
                    ))}
                </Stack>
                <Stack
                    sx={{
                        width: '100%',
                        background: 'white',
                        height: '50px',
                        borderBottomLeftRadius: '5px',
                        borderBottomRightRadius: '5px',
                        alignSelf: 'flex-end',
                        alignItems: 'center',
                    }}
                    direction="row"
                    spacing={1}
                >
                    <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                        <InsertEmoticonRoundedIcon />
                    </IconButton>
                    <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                        <AttachmentRoundedIcon />
                    </IconButton>
                    <TextField
                        variant="standard"
                        placeholder="Type a message"
                        sx={{
                            flexGrow: 1,
                            borderBottom: '0px'
                        }}
                        onChange={handleMessage}
                        onSubmit={sendMessage}
                    />
                    <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                        <SendIcon onClick={sendMessage} />
                    </IconButton>
                </Stack>
            </Stack> : <Stack
                sx={{
                    width: '75%',
                    height: '88vh',
                    backgroundColor: 'gray',
                    backgroundImage: `url(${RightBGI})`,
                    backgroundSize: 'contain',
                    borderRadius: '3px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            />}
        </>
    )
}

export default BodyRight;
