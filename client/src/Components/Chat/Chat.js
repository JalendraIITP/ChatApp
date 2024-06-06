import * as React from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import { Avatar, Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../ReduxToolkits/Store';
import { useContext } from 'react';
import UseContext from '../../context/UseContext';
const Chat = (props) => {
    const { getIdMapping } = useContext(UseContext)
    const { userId, friendId } = useSelector(state => state.Chat)
    const data = props.data
    const Id = (data.Friend === userId) ? data.Creator : data.Friend;
    const Name = getIdMapping(Id)?.fullname;
    const dispatch = useDispatch();
    const [isHovered, setIsHovered] = useState(false);
    const [showRough, setShowRough] = useState(false);

    const handleClickProfile = (e) => {
        e.stopPropagation();
        setShowRough(true);
    };

    const handleParentClick = () => {
        dispatch(authActions.changeFriend({ Id: Id }));
    };

    return (
        <Stack
            direction="row"
            spacing={1.7}
            onClick={handleParentClick}
            sx={{
                background: isHovered ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
                borderRadius: '5px',
                alignItems: 'center',
                padding: '8px',
                cursor: 'pointer',
                border: 'none',
                background: Id == friendId ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.5)',
                transition: 'background 0.3s ease',
                ':hover': {
                    background: 'rgba(0, 0, 0, 0.7)',
                },
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Stack sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar />
            </Stack>

            <Stack direction="column">
                <Typography fontSize={15}>{Name}</Typography>
            </Stack>

        </Stack>
    );
};

export default Chat;
