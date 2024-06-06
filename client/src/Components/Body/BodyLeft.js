import { Button, Stack, Typography } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import Chat from '../Chat/Chat'
import axios from 'axios'
import UseContext from '../../context/UseContext'

const BodyLeft = () => {
    const [chatData, setChatData] = useState([]);
    const { update } = useContext(UseContext);
    const fetchData = async () => {
        try {
            const response = await axios.post('http://localhost:9000/getChat', {}, { withCredentials: true });
            setChatData(response.data)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchData()
    }, [update]);
    return (
        <Stack spacing={0.5} direction={'column'} sx={{
            width: '25%',
            backgroundColor: 'white',
            borderRadius: '3px',
            position: 'relative',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
                display: 'none'
            },
        }}>
            <Stack sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1,
                backgroundColor: 'white',
                borderRadius: '3px 3px 0px 0px',
                padding: '5px',
                fontSize: '30px',
                alignItems: "center",
            }}>
                My Chat
            </Stack>
            <Stack spacing={'6px'} padding={'2px 10px'}>
                {chatData.map((item, index) => (
                    <Chat key={index} data={item} />
                ))}
            </Stack>
        </Stack>

    )
}

export default BodyLeft
