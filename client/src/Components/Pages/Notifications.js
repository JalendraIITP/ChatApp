import GroupAdd from '@mui/icons-material/GroupAdd'
import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'

const Notifications = () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    return (
        <Stack sx={{
            height: '500px',
            width: '400px',
            background: 'linear-gradient(to right, #ec2F4B, #009FFF)',
            color: 'white',
            clipPath: 'ellipse(100vw 60vh at 50% 50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '5px',
            overflow: 'auto',
        }}>
            <h2>Notifications</h2>

            <Stack sx={{
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
                border: '1px solid white',
                overflow: 'auto',
                padding: '10px',
                marginTop: '0px',
                position: 'relative',
                borderRadius: '5px',
            }}>
                {data.map((item, index) => (
                    <Stack sx={{
                        width: '90%',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'centre',
                        gap: '30px',
                        border: '1px solid white',
                        borderRadius: '5px',
                    }}>
                        <Stack sx={{ margin: '2px 2px 2px 2px' }}>
                            <Avatar />
                        </Stack>
                        <Typography sx={{
                            width: '100%',
                            overflow: 'hidden',
                            marginLeft: '-25px',
                            marginRight: '2px',
                            backgroundColor: 'red'
                        }}>Name{item}</Typography>
                    </Stack>
                ))}
            </Stack>
            <Typography sx={{
                height: '60px',
            }}></Typography>

        </Stack>
    )
}

export default Notifications
