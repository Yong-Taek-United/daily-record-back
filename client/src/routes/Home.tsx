import React, { MouseEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Daily from '../components/Daily';
import { api } from '../utils/authInstance';

type TServerData = {
    Success: boolean,
    userData: {
        userId: number;
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


    const [UserId, setUserId] = useState(0);
    const [DailyData, setDailyData] = useState<TDailyData[]>([]);

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');

        api().get<TServerData>('/auth', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
            }).then(res => {
                if(res.data.userData.userId) {
                    setUserId(res.data.userData.userId);
                } else {
                    navigate('/login')
                }
            }).catch(Error => {
                navigate('/login');
        });
    }, []);

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', backgroundColor: '#f1f1f1'}}>
            <Daily userId={UserId} />
        </div>
    );
};

export default Home