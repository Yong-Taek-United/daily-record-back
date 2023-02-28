import React, { MouseEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Daily from '../components/Daily';
import { api } from '../utils/authInstance';
import { Box, Drawer } from '@mui/material';

type ServerData = {
    userData: {
        userId: number;
        email: string;
        username: string;
    }
}

const Home = () => {
    const navigate = useNavigate();


    const [UserId, setUserId] = useState(0);
    const [OpenToggle, setOpenToggle] = useState(false);
    console.log(OpenToggle)

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');

        api().get<ServerData>('/auth', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => {
            if(res.data.userData.userId) {
                setUserId(res.data.userData.userId);
            } else {
                navigate('/login')
            }
        }).catch(Error => {
            navigate('/login');
        });
    }, []);

    const toggleDrawer =
        (e: React.KeyboardEvent | React.MouseEvent) => {
            if (
                e.type === 'keydown' &&
                ((e as React.KeyboardEvent).key === 'Tab' ||
                    (e as React.KeyboardEvent).key === 'Shift')
            ) {
            return;
        }
        if(OpenToggle) {
            setOpenToggle(false);
            return;
        }
        setOpenToggle(true);
    };

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', backgroundColor: '#f1f1f1'}}>
            <Daily userId={UserId} toggleDrawer={toggleDrawer} />
            <Drawer
                anchor='right'
                open={OpenToggle}
                onClose={toggleDrawer}
            >
                <Box
                    sx={{ width: 400 }}
                    onClick={toggleDrawer}
                    onKeyDown={toggleDrawer}
                >
                </Box>
            </Drawer>
        </div>
    );
};

export default Home