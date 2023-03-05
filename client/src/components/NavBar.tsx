import { KeyboardEvent, MouseEvent, useCallback } from 'react';
import { AppBar,Box, Toolbar, Typography, Button, IconButton, } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import * as type from '../redux/types'
import { OpenDailyToggle, setDailyDate } from '../redux/actions/dailyAction';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers/rootReducer';
import dayjs, { Dayjs } from 'dayjs';

const NavBar = () => {

    const {CurrUserData} = useSelector((state: RootState) => state.userReducer);
    
    const Today = dayjs();
    const dispatch = useDispatch();

    const setOpenToggle = useCallback(
        (isOpened: type.isOpened) => dispatch(OpenDailyToggle(isOpened)),
        [dispatch]
    );
    const setCurDailyDate = useCallback(
        (dailyDate: type.dailyDate) => dispatch(setDailyDate(dailyDate)),
        [dispatch]
    );

    const toggleDrawer = (open: boolean, dailyDate: Dayjs) => 
        (e: KeyboardEvent | MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as KeyboardEvent).key === 'Tab' ||
                    (e as KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            setCurDailyDate(dailyDate);
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
                        onClick={toggleDrawer(true, Today)}
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