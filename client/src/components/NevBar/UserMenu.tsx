import { KeyboardEvent, MouseEvent, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import dayjs from 'dayjs';
import * as type from '../../redux/types'
import { RootState } from '../../redux/reducers/rootReducer';
import { setUserData } from '../../redux/actions/userAction';
import { OpenDailyToggle, setDailyDate } from '../../redux/actions/dailyAction';

const UserMenu = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);

    const setCurUser = useCallback(
        (user: type.userData) => dispatch(setUserData(user)),
        [dispatch]
    );
    const setToggleValue = useCallback(
        (isOpened: type.isOpened) => dispatch(OpenDailyToggle(isOpened)),
        [dispatch]
    );
    const setCurDailyDate = useCallback(
        (dailyDate: type.dailyDate) => dispatch(setDailyDate(dailyDate)),
        [dispatch]
    );

    // 데일리 토글 열기/닫기
    const toggleHandler = (open: boolean, dailyDate: string) => 
        (e: KeyboardEvent | MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as KeyboardEvent).key === 'Tab' ||
                    (e as KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            setCurDailyDate(dayjs(dailyDate));
            setToggleValue(open);
    };

     // 회원 메뉴 열기
    const menuOpenHandler = (e: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget);
    };

     // 회원 메뉴 닫기
    const menuCloseHandler = () => {
        setAnchorEl(null);
    };

    // 로그아웃
    const Logout = () => {
        localStorage.removeItem('access_token');
        menuCloseHandler();
        setCurUser(null);
        navigate('/login');
    }

    const Today = dayjs().format('YYYY-MM-DD');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuValue = Boolean(anchorEl);

    return (
        <Box>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleHandler(true, Today)}
            >
                <AddCircle />
            </IconButton>
            <Button
                id="basic-button"
                aria-controls={menuValue ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={menuValue ? 'true' : undefined}
                color="inherit"
                onClick={menuOpenHandler}
            >
                {CurUserData?.username}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={menuValue}
                onClose={menuCloseHandler}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem >마이페이지</MenuItem>
                <MenuItem onClick={Logout}>로그아웃</MenuItem>
            </Menu>
        </Box>
    );
};

export default UserMenu;