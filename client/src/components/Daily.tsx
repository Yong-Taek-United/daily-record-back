import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';

type Tprops = {
    userId: number;
    toggleDrawer(e: any): void;
}

type TDailisInfo = {
    id: number;
    createdAt: string;
}

function Daily(props: Tprops) {
    const {userId, toggleDrawer} = props

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
            <Grid item xs={12/7}>
                <Box>
                    <Paper style={{maxWidth: '130px', minHeight: '130px', margin: 0}} elevation={3} onClick={toggleDrawer}>
                        <p>{daily.id}</p>
                        <p>{daily.createdAt}</p>
                    </Paper>
                </Box>
            </Grid>
        );
    });

    return (
        // <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Grid style={{display: 'flex', alignItems: 'center'}} container spacing={2}>
            
                {renderDaily}
            
        </Grid>
    );
};

export default Daily