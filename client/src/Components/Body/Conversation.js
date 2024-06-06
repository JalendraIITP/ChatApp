import { React, useContext } from 'react';
import { Stack, Typography } from '@mui/material';
import moment from 'moment';
import { useSelector } from 'react-redux';
import UseContext from '../../context/UseContext';
function Conversation(message) {
    const { getIdMapping } = useContext(UseContext)
    message = message.data;
    const { userId } = useSelector(state => state.Chat);
    const sameSender = (userId === message.Sender);
    const sender = !sameSender ? getIdMapping(message.Sender)?.fullname : getIdMapping(userId)?.fullname, content = String(message.Content), time = moment(message.createdAt).format('HH:mm');
    return (
        <Stack spacing={-0.5} sx={{
            alignSelf: sameSender ? "flex-end" : "flex-start",
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '5px',
            padding: '2px 8px 0px',
            width: 'fit-content',
            maxWidth: '80%',
        }}>
            {!sameSender && <Typography color={'#2694ab'} fontWeight={'600'} variant={'caption'}>{sender}</Typography>}
            <Typography
                sx={{
                    wordBreak: 'break-word',
                    maxWidth: content.length > 400 ? '80%' : '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-end'
                }}
            >
                {content}
            </Typography>
            <Typography variant={'caption'} color={'text.secondary'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} >{time}</Typography>
        </Stack>

    );
}

export default Conversation;
