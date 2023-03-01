import React, { useCallback, useEffect, useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { api } from '../utils/authInstance';
import { useDispatch } from 'react-redux';
import * as type from '../redux/types'
import { OpenDailyToggle, setDailyData } from '../redux/actions/dailyAction';
import DailyToggle from './DailyToggle';

type Tprops = {
    userId: number;
}

interface TDailisInfo {
    id: number;
    createdAt: string;
    events: {
        id: number;
        description: string;
    }[] | null
}

function Daily(props: Tprops) {
    const {userId} = props

    const dispatch = useDispatch();
    
    const [Dailies, setDailies] = useState<TDailisInfo[]>([]);
    
    const setOpenToggle = useCallback(
        (isOpened: type.isOpened) => dispatch(OpenDailyToggle(isOpened)),
        [dispatch]
        );

    const setCurrDaily = useCallback(
        (dailiy: type.dailyData) => dispatch(setDailyData(dailiy)),
        [dispatch]
    );

    useEffect(() => {
        api().get(`/dailies/getDailies/${userId}`)
            .then(res => {
                setDailies(res.data.dailyData);
            }).catch(Error => {
                console.log(Error);
        });
    }, [userId])

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
                        <p>{daily.createdAt}</p>
                    </Paper>
                </Box>
                
            </Grid>
        );
    });

    return (
        <Grid style={{display: 'flex', alignItems: 'center'}} container spacing={2}>
            
                {renderDaily}
                <DailyToggle setOpenToggle={setOpenToggle}/>
                {/* <Drawer
                    anchor='right'
                    open={openCloseValue}
                    onClose={toggleDrawer(false)}
                >
                    <Box
                        sx={{ width: 400 }}
                    >
                        <p>{CurDailyData?.id}</p>
                        <p>{CurDailyData?.createdAt}</p>
                        <div>
                            {CurDailyData?.events?.map((event, i) => {
                                return (<p key={i}>{event.description}</p>)
                            })}
                        </div>
                    </Box>
                </Drawer> */}
        </Grid>
    );
};

export default Daily