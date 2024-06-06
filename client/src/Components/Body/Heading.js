import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import UseContext from '../../context/UseContext';
const Heading = () => {
    const { friendId } = useSelector((state) => state.Chat);
    const { getIdMapping } = useContext(UseContext);
    const Name = getIdMapping(friendId)?.fullname
    return (
        <Stack direction="row"
            spacing={1.7}
            sx={{
                background: 'white',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px',
                alignItems: 'center',
                padding: '8px',
                cursor: 'pointer',
                border: 'none',
            }}>
            <Avatar sx={{ margin: '0 8px' }} alt="Avatar" src="" />
            <Stack direction="column" >
                <Typography fontSize={15}>{Name}</Typography>
                <Stack direction="row" sx={{ alignItems: 'center' }}>
                    <FiberManualRecordIcon sx={{ fontSize: 10, color: 'green', marginRight: '2px', alignItems: 'center' }} />
                    <Typography fontSize={10}>Online</Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default Heading
