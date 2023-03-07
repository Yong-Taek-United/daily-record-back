import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, Box } from '@mui/material';
import * as type from '../redux/types'
import { setUserData } from '../redux/actions/userAction';
import { api } from '../utils/authInstance';
import Daily from '../components/Daily';

type TServerAuthData = {
    userData: {
        id: number;
        email: string;
        username: string;
    }
}

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const setCurUser = useCallback(
        (user: type.userData) => dispatch(setUserData(user)),
        [dispatch]
    );

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');

        api().get<TServerAuthData>('/auth', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
            }).then(res => {
                if(res.data.userData) {
                    setCurUser(res.data.userData);
                } else {
                    navigate('/login');
                }
            }).catch(Error => {
                navigate('/login');
        });
    }, []);

    return (
        <Container
            maxWidth="lg"
            sx={{height: '100vh'}}
        >
            <Box
                sx={{pt: 12}}
            >
                <Daily/>
            </Box>
        </Container>
    );
};

export default Home;