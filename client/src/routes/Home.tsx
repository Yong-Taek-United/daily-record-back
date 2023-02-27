import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        axios.get('http://localhost:5000/auth', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }).then(res => {
            if(res.data.userId) {
                console.log(res.data)
            } else {
                navigate('/login')
            }
        }).catch(Error => {
            console.log(Error)
            navigate('/login')
        })
    }, [])
    

    return (
        <div>Home</div>
    )
}

export default Home