import React from 'react';
import { Avatar, Typography, Box, Container, Grid } from '@mui/material';

const Profile = () => {
    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                background: 'linear-gradient(to right, #ec2F4B, #009FFF)',
                color: 'white',
                clipPath: 'ellipse(100vw 60vh at 50% 50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px'
            }}
        >
            <Container sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Avatar
                    src=""
                    sx={{
                        height: '6rem',
                        width: '6rem',
                        borderRadius: '50%',
                        border: '2px solid #fff',
                    }}
                />
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 400,
                        fontSize: '1.3rem',
                        margin: '1rem 0',
                    }}
                >
                    Claire Doe
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    <Box sx={{ width: '10rem', textAlign: 'center' }}>
                        <Typography variant="h4">20</Typography>
                        <Typography>Friends</Typography>
                    </Box>
                    <Box sx={{ width: '10rem', textAlign: 'center' }}>
                        <Typography variant="h4">10</Typography>
                        <Typography>Groups</Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default Profile;
