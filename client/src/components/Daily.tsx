import axios from 'axios';
import React, { useEffect, useState } from 'react'

type Tprops = {
    userId: number;
    openDailyDetail(e: any): void;
}

type TDailisInfo = {
    id: number;
    createdAt: string;
}

function Daily(props: Tprops) {
    const {userId, openDailyDetail} = props

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
            <div key={i} style={{width: 100, height: 100, margin: 20, backgroundColor: 'gray'}} onClick={openDailyDetail}>
                <p>{daily.id}</p>
                <p>{daily.createdAt}</p>
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