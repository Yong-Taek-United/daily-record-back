import { useSelector } from 'react-redux';
import { AppBar,Box, Toolbar, Typography, Button } from '@mui/material';
import { RootState } from '../../redux/reducers/rootReducer';
import UserMenu from './UserMenu';

const NavBar = () => {
    const {CurUserData} = useSelector((state: RootState) => state.userReducer);

    return (
        <Box sx={{ flexGrow: 1}}>
        <AppBar>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    하루기록
                </Typography>
                {CurUserData?.id ?
                    <UserMenu />
                :
                    <Button color="inherit">Login</Button>
                }
            </Toolbar>
        </AppBar>
        </Box>
    );
}

export default NavBar;