import React from 'react'
import axios from 'axios'
import BodyLeft from './BodyLeft'
import BodyRight from './BodyRight'
import { Stack } from '@mui/material'
import { useContext, useEffect } from 'react'
import UseContext from '../../context/UseContext'
const Body = () => {
    const { update, addObjectsToMap } = useContext(UseContext)
    const getAll = async () => {
        try {
            const response = await axios.get('http://localhost:9000/getall', { withCredentials: true })
            addObjectsToMap(response.data)
            console.log(response.data)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getAll();
    }, [update])
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90.8vh' }}>
            <Stack
                spacing={'0.5%'}
                direction={'row'}
                sx={{ width: '99%', height: '88vh', borderRadius: '3px' }}
            >
                <BodyLeft />
                <BodyRight />
            </Stack>
        </div >
    )
}

export default Body

