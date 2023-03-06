import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Daily from '../components/Daily';
import { api } from '../utils/authInstance';
import { setUserData } from '../redux/actions/userAction';
import * as type from '../redux/types'
import { Container } from '@mui/material';

type TServerData = {
    userData: {
        id: number;
        email: string;
        username: string;
    }
}

const Home = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const setCurrUser = useCallback(
        (user: type.userData) => dispatch(setUserData(user)),
        [dispatch]
    );

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');

        api().get<TServerData>('/auth', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
            }).then(res => {
                if(res.data.userData) {
                    setCurrUser(res.data.userData);
                } else {
                    navigate('/login')
                }
            }).catch(Error => {
                navigate('/login');
        });
    }, []);

    return (
        <Container
            maxWidth="lg"
            sx={{height: '100vh', pt: 12}}
        >
            <Daily/>
        </Container>
    );
};

export default Home;