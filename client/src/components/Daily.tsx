import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { api } from '../utils/authInstance';
import { useDispatch, useSelector } from 'react-redux';
import * as type from '../redux/types'
import { OpenDailyToggle, setDailyData } from '../redux/actions/dailyAction';
import DailyToggle from './DailyToggle';
import { RootState } from '../redux/reducers/rootReducer';

// type Tprops = {
//     userId: number;
// }

interface TDailisInfo {
    id: number;
    date: string;
    events: {
        id: number;
        description: string;
    }[] | null
}

function Daily() {
    // const {userId} = props

    const dispatch = useDispatch();
    
    const [Dailies, setDailies] = useState<TDailisInfo[]>([]);
    const {CurrUserData} = useSelector((state: RootState) => state.userReducer);
    console.log(CurrUserData?.id)
    const setOpenToggle = useCallback(
        (isOpened: type.isOpened) => dispatch(OpenDailyToggle(isOpened)),
        [dispatch]
        );

    const setCurrDaily = useCallback(
        (dailiy: type.dailyData) => dispatch(setDailyData(dailiy)),
        [dispatch]
    );

    useEffect(() => {
        api().get(`/dailies/getDailies/${CurrUserData?.id}`)
            .then(res => {
                setDailies(res.data.dailyData);
            }).catch(Error => {
                console.log(Error);
        });
    }, [CurrUserData?.id])

    const toggleDrawer = (open: boolean, dailiy?: any) => 
        (e: React.KeyboardEvent | React.MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as React.KeyboardEvent).key === 'Tab' ||
                    (e as React.KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            setCurrDaily(dailiy);
            setOpenToggle(open);
    };

    const renderDaily = Dailies.map((daily, i) => {
        return (
            <Grid item xs={12/7} key={i}>
                <Box>
                    <Paper style={{maxWidth: '130px', minHeight: '130px', margin: 0}} elevation={3} onClick={toggleDrawer(true, daily)}>
                        <p>{daily.id}</p>
                        <p>{daily.date}</p>
                    </Paper>
                </Box>
                
            </Grid>
        );
    });

    return (
        <Grid style={{display: 'flex', alignItems: 'center'}} container spacing={2}>
            {renderDaily}
            <DailyToggle setOpenToggle={setOpenToggle}/>
        </Grid>
    );
};

export default Daily