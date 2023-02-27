import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

type props = {userId: number;}

type TDailisInfo = {
    id: number;
    createdAt: string;
}

function Daily({userId}: props) {

    const navigate = useNavigate();

    const [Dailies, setDailies] = useState<TDailisInfo[]>([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/dailies/getDailies/${userId}`)
            .then(res => {
                setDailies(res.data.dailyData)
            }).catch(Error => {
                console.log(Error)
        });
    }, [userId])

    const renderDaily = Dailies.map((daily, i) => {
        return (
            <div key={i}>
                {daily.id} {daily.createdAt}
            </div>
        );
    });

    return (
        <div>
            <h2>Daily</h2>
            {renderDaily}
        </div>
    );
};

export default Daily