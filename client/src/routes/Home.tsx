import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Daily from '../components/Daily';

const Home = () => {
    const navigate = useNavigate();

    const [UserId, setUserId] = useState(0);

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');

        axios.get('http://localhost:5000/auth', {
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
    }, [])

    return (
        <div>
            <h2>Home</h2>
            <Daily userId={UserId} />
        </div>
    );
};

export default Home