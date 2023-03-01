import React, { useCallback, useEffect, useState } from 'react';
import { AppBar,Box, Toolbar, Typography, Button, IconButton, } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { api } from '../utils/authInstance';
import { useDispatch } from 'react-redux';
import * as type from '../redux/types'
import { OpenDailyToggle, setDailyData } from '../redux/actions/dailyAction';
import DailyToggle from './DailyToggle';

type ServerData = {
    userData: {
        userId: number;
        email: string;
        username: string;
    }
}

const NavBar = () => {

    const dispatch = useDispatch();
    const setOpenToggle = useCallback(
        (isOpened: type.isOpened) => dispatch(OpenDailyToggle(isOpened)),
        [dispatch]
    );
    const setCurrDaily = useCallback(
        (dailiy: type.dailyData) => dispatch(setDailyData(dailiy)),
        [dispatch]
    );

    const [UserId, setUserId] = useState(0);
    const [Username, setUsername] = useState('');
    
    useEffect(() => {
        const access_token = localStorage.getItem('access_token');

        api().get<ServerData>('/auth', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => {
            if(res.data) {
                setUserId(res.data.userData.userId);
                setUsername(res.data.userData.username);
            }
        }).catch(Error => {
            console.log(Error)
        });
    }, []);

    const toggleDrawer = (open: boolean, dailiy?: any) => 
        (e: React.KeyboardEvent | React.MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as React.KeyboardEvent).key === 'Tab' ||
                    (e as React.KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            setCurrDaily(dailiy);
            setOpenToggle(open);
    };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                하루기록
            </Typography>
            {UserId ?
                <div>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={toggleDrawer(true)}
                    >
                        <AddCircle />
                    </IconButton>
                    <Button color="inherit">{Username}</Button>
                </div>
            :
                <Button color="inherit">Login</Button>
            }
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;