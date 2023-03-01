import React, { useEffect, useState } from 'react';
import { AppBar,Box, Toolbar, Typography, Button, IconButton, } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { api } from '../utils/authInstance';

type ServerData = {
    userData: {
        userId: number;
        email: string;
        username: string;
    }
}

const NavBar = () => {

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
      
    }, [])
    

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