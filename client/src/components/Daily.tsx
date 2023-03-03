import { KeyboardEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Box, Grid, Paper, Card, IconButton, Popover, Typography} from '@mui/material';
import { RemoveCircle, CheckCircleOutline, HighlightOff } from '@mui/icons-material';
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
        }[]
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

    const getDailis = () => {
        if(CurrUserData){
            api().get<TServerData>(`/dailies/getDailies/${CurrUserData.id}`)
                .then(res => {
                    setDailies(res.data.dailyData);
                }).catch(Error => {
                    console.log(Error);
            });
        }
    };

    useEffect(() => {
        getDailis();
    }, [CurrUserData, DailiesData]);


    const [DeleteMsg, setDeleteMsg] = useState<HTMLButtonElement | null>(null);
    const handleClick = (dailyId?: number) => (e: MouseEvent<HTMLButtonElement>) => {
        if(dailyId) {
            setCurrDailyId(dailyId);
        }
        setDeleteMsg(e.currentTarget);
    };
    const handleClose = () => {
        setDeleteMsg(null);
    };
    const deleteMsgOpen = Boolean(DeleteMsg);
    const deleteMsgId = deleteMsgOpen ? 'simple-popover' : undefined;

    const [CurrDailyId, setCurrDailyId] = useState<number | null>(null);
    const deleteDaily = () => {
        if(CurrUserData && CurrDailyId){
            api().delete(`/dailies/${CurrDailyId}`)
                .then(res => {
                    setCurrDailyId(null);
                    handleClose();
                }).catch(Error => {
                    console.log(Error);
            });
        }
    };

    const renderDaily = DailiesData.map((daily, i) => {
        return (
            <Grid item xs={12/7} key={i}>
                <Box>
                    <Card sx={{width: 130, height: 130, margin: 0}} elevation={3}>
                        <IconButton
                            size="small"
                            // edge="end"
                            color="inherit"
                            aria-label="delete"
                            sx={{ mr: 2}}
                            onClick={handleClick(daily?.id)}
                        >
                            <RemoveCircle color='error'/>
                        </IconButton>
                        <Box onClick={toggleDrawer(true, daily)}>
                            <Typography variant="h6" component="div">
                                {dayjs(daily?.date).format('YYYY-MM-DD')}
                            </Typography>
                            <Box>
                                {daily?.events?.map((event, j) => {
                                    return <Typography key={j} variant="body1"> {event.description}</Typography>
                                })}
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </Grid>
        );
    });

    return (
        <Grid style={{display: 'flex', alignItems: 'center'}} container spacing={2}>
            {renderDaily}
            <DailyToggle getDailis={getDailis} setOpenToggle={setOpenToggle} setCurrDaily={setCurrDaily}/>
            <Popover
                id={deleteMsgId}
                open={deleteMsgOpen}
                anchorEl={DeleteMsg}
                onClose={handleClose}
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
                }}
            >
                <Typography fontSize={15} sx={{ p: 2 }}>데일리를 삭제하시겠습니까?</Typography>
                <Box>
                    <IconButton
                        size="small"
                        // edge="end"
                        color="inherit"
                        aria-label="execute"
                        sx={{ mr: 1 }}
                        onClick={deleteDaily}
                    >
                        <CheckCircleOutline color='success' />
                    </IconButton>
                    <IconButton
                        size="small"
                        // edge="end"
                        color="inherit"
                        aria-label="cancel"
                        sx={{ mr: 1 }}
                        onClick={handleClose}
                    >
                        <HighlightOff color='error' />
                    </IconButton>
                </Box>
            </Popover>
        </Grid>
    );
};

export default Daily