import * as React from 'react';
import axios from 'axios'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { authActions } from '../../ReduxToolkits/Store';
const SignIn = () => {
    const dispatch = useDispatch();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formDataObj = {};
        data.forEach((value, key) => {
            formDataObj[key] = value;
        });
        try {
            const response = await axios.post('http://localhost:9000/login', formDataObj, { withCredentials: true });
            dispatch(authActions.setUser({ Id: response.data.data.user._id }));
        } catch (e) {
            console.log(e)
        }
    };
    return (
        <Box
            sx={{
                marginTop: 10,
                marginLeft: 2,
                marginRight: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign In
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "2px"
                    }}>
                        <Typography>Don't have an account?</Typography>
                        <Link href='/signup' variant="body2" underline='none'>
                            Create Account
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    );
}

export default SignIn;
