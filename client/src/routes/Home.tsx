import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Daily from '../components/Daily';
import { api } from '../utils/authInstance';
import { setUserData } from '../redux/actions/userAction';
import * as type from '../redux/types'

type TServerData = {
    Success: boolean,
    userData: {
        id: number;
        email: string;
        username: string;
    },
    dailyData: {
        id: number;
        createdAt: Date;
    }
}

type TDailyData = {
    id: number;
    createdAt: Date;
}

const Home = () => {
    const navigate = useNavigate();

    // const [UserId, setUserId] = useState(0);
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
        <div style={{display: 'flex', width: '100%', height: '100%', backgroundColor: '#f1f1f1'}}>
            <Daily/>
        </div>
    );
};

export default Home