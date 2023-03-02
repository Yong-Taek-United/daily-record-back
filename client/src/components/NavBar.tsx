import React, { useCallback } from 'react';
import { AppBar,Box, Toolbar, Typography, Button, IconButton, } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import * as type from '../redux/types'
import { OpenDailyToggle, setDailyData } from '../redux/actions/dailyAction';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers/rootReducer';

const NavBar = () => {

    const {CurrUserData} = useSelector((state: RootState) => state.userReducer);
    
    const dispatch = useDispatch();

    const setOpenToggle = useCallback(
        (isOpened: type.isOpened) => dispatch(OpenDailyToggle(isOpened)),
        [dispatch]
    );
    const setCurrDaily = useCallback(
        (dailiy: type.dailyData) => dispatch(setDailyData(dailiy)),
        [dispatch]
    );

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
            {CurrUserData?.id ?
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
                    <Button color="inherit">{CurrUserData?.username}</Button>
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