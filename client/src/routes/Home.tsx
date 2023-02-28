import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Daily from '../components/Daily';
import DailyDetail from '../components/DailyDetail';
import { api } from '../utils/authInstance';

type ServerData = {
    userId: number;
  }

const Home = () => {
    const navigate = useNavigate();

    const detailRef = useRef<HTMLDivElement>(null);

    const [UserId, setUserId] = useState(0);
    const [ActionDailyDetail, setActionDailyDetail] = useState(false);

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');

        api().get<ServerData>('/auth', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => {
            if(res.data.userId) {
                setUserId(res.data.userId);
            } else {
                navigate('/login')
            }
        }).catch(Error => {
            navigate('/login')
        });

        const closeDailyDetail = (e: any) => {
            if(ActionDailyDetail && detailRef.current && !detailRef.current.contains(e.target)) {
                setActionDailyDetail(false);
            }
        };

        document.addEventListener('mousedown', closeDailyDetail);
        return () => {
            document.removeEventListener('mousedown', closeDailyDetail);
        };

    }, [ActionDailyDetail]);

    const openDailyDetail = () => {
        setActionDailyDetail(true);
    };

    return (
        <div style={{display: 'flex', width: '100%', height: '100%', backgroundColor: '#f1f1f1'}}>
            <div style={{width: '100%', height: '100%'}} >
                <h2>Home</h2>
                <Daily userId={UserId} openDailyDetail={openDailyDetail}/>
            </div>
            {ActionDailyDetail &&
                <DailyDetail detailRef={detailRef} />
            }
        </div>
    );
};

export default Home