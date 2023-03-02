import { KeyboardEvent, MouseEvent, useCallback, useEffect } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import { api } from '../utils/authInstance';
import { useDispatch, useSelector } from 'react-redux';
import * as type from '../redux/types'
import { OpenDailyToggle, setDailiesData, setDailyData } from '../redux/actions/dailyAction';
import DailyToggle from './DailyToggle';
import { RootState } from '../redux/reducers/rootReducer';
import dayjs from 'dayjs';

type TServerData = {
    Success: boolean,
    dailyData: {
        id: number;
        date: string;
        events: {
            id: number;
            description: string;
        }[] | null
    }[]
}

function Daily() {
    const {CurrUserData} = useSelector((state: RootState) => state.userReducer);
    const {DailiesData} = useSelector((state: RootState) => state.dailyReducer);

    const dispatch = useDispatch();
    
    const setOpenToggle = useCallback(
        (isOpened: type.isOpened) => dispatch(OpenDailyToggle(isOpened)),
        [dispatch]
    );
    const setCurrDaily = useCallback(
        (dailiy: type.dailyData) => dispatch(setDailyData(dailiy)),
        [dispatch]
    );
    const setDailies = useCallback(
        (dailiesData: type.dailyData[]) => dispatch(setDailiesData(dailiesData)),
        [dispatch]
    );

    useEffect(() => {
        if(CurrUserData){
            api().get<TServerData>(`/dailies/getDailies/${CurrUserData.id}`)
                .then(res => {
                    setDailies(res.data.dailyData);
                }).catch(Error => {
                    console.log(Error);
            });
        }
    }, [CurrUserData?.id, DailiesData])

    const toggleDrawer = (open: boolean, dailiy: any) => 
        (e: KeyboardEvent | MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as KeyboardEvent).key === 'Tab' ||
                    (e as KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            setCurrDaily(dailiy);
            setOpenToggle(open);
    };

    const renderDaily = DailiesData.map((daily, i) => {
        return (
            <Grid item xs={12/7} key={i}>
                <Box>
                    <Paper style={{maxWidth: '130px', minHeight: '130px', margin: 0}} elevation={3} onClick={toggleDrawer(true, daily)}>
                        <div>
                            <p>{dayjs(daily?.date).format('YYYY-MM-DD')}</p>
                        </div>
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