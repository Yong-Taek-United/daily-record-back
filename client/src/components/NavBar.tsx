import { KeyboardEvent, MouseEvent, useCallback, useState } from 'react';
import { AppBar,Box, Toolbar, Typography, Button, IconButton, Menu, MenuItem, } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import * as type from '../redux/types'
import { OpenDailyToggle, setDailyDate } from '../redux/actions/dailyAction';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers/rootReducer';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../redux/actions/userAction';

const NavBar = () => {

    const {CurrUserData} = useSelector((state: RootState) => state.userReducer);
    
    const Today = dayjs();

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const setCurrUser = useCallback(
        (user: type.userData) => dispatch(setUserData(user)),
        [dispatch]
    );
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

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const Logout = () => {
        localStorage.removeItem('access_token');
        handleClose();
        setCurrUser(null);
        navigate('/login');
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    하루기록
                </Typography>
                {CurrUserData?.id ?
                    <Box>
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
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            color="inherit"
                            onClick={handleClick}
                        >
                            {CurrUserData.username}
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            MenuListProps={{
                            'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem >마이페이지</MenuItem>
                            <MenuItem onClick={Logout}>로그아웃</MenuItem>
                        </Menu>
                    </Box>
                :
                    <Button color="inherit">Login</Button>
                }
            </Toolbar>
        </AppBar>
        </Box>
    );
}

export default NavBar;