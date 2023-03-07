import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, Box } from '@mui/material';
import * as type from '../redux/types'
import { setUserData } from '../redux/actions/userAction';
import { api } from '../utils/authInstance';
import DailyBoard from '../components/Board/Board';
import DailyToggle from '../components/Toggle/Toggle';

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

    // 로그인 인증
    const getDailyByDate = async() => {
        const access_token = localStorage.getItem('access_token');
        await api().get<TServerAuthData>('/auth', {
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
    };

    useEffect(() => {
        getDailyByDate();
    }, []);

    return (
        <Container
            maxWidth="lg"
            sx={{height: '100vh'}}
        >
            <DailyBoard />
            <DailyToggle />
        </Container>
    );
};

export default Home;