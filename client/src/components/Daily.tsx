import { KeyboardEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Box, Grid, Paper, Card, IconButton, Popover, Typography, ButtonGroup, Button, Pagination, Chip} from '@mui/material';
import { RemoveCircle, CheckCircleOutline, HighlightOff, ChevronLeftOutlined, ChevronRightOutlined } from '@mui/icons-material';
import { api } from '../utils/authInstance';
import { useDispatch, useSelector } from 'react-redux';
import * as type from '../redux/types'
import { OpenDailyToggle, setDailiesData, setDailyData, setDailyDate } from '../redux/actions/dailyAction';
import DailyToggle from './DailyToggle';
import { RootState } from '../redux/reducers/rootReducer';
import dayjs from 'dayjs';

type TServerData = {
    Success: boolean,
    dailyData: {
        id: number;
        year: number;
        month: number;
        day: number;
        events: {
            id: number;
            description: string;
        }[]
    }[]
}

function Daily() {
    const Year = Number(dayjs().format('YYYY'));
    const Month = Number(dayjs().format('MM'));
    const [CurYearMonth, setCurYearMonth] = useState([Year, Month]);

    const {CurrUserData} = useSelector((state: RootState) => state.userReducer);
    const {DailiesData} = useSelector((state: RootState) => state.dailyReducer);

    const dispatch = useDispatch();
    
    const setOpenToggle = useCallback(
        (isOpened: type.isOpened) => dispatch(OpenDailyToggle(isOpened)),
        [dispatch]
    );
    const setCurDailyDate = useCallback(
        (dailyDate: type.dailyDate) => dispatch(setDailyDate(dailyDate)),
        [dispatch]
    );
    const setCurrDaily = useCallback(
        (daily: type.dailyData) => dispatch(setDailyData(daily)),
        [dispatch]
    );
    const setDailies = useCallback(
        (dailiesData: type.dailyData[]) => dispatch(setDailiesData(dailiesData)),
        [dispatch]
    );

    const toggleDrawer = (open: boolean, dailyDate: string) => 
        (e: KeyboardEvent | MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as KeyboardEvent).key === 'Tab' ||
                    (e as KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            setCurDailyDate(dayjs(dailyDate));
            setOpenToggle(open);
    };

    const getDailis = () => {
        if(CurrUserData){
            api().get<TServerData>(`/dailies/getDailies/${CurrUserData.id}/${CurYearMonth[0]}/${CurYearMonth[1]}`)
                .then(res => {
                    setDailies(res.data.dailyData);
                }).catch(Error => {
                    console.log(Error);
            });
        }
    };

    useEffect(() => {
        getDailis();
    }, [CurrUserData, DailiesData, CurYearMonth]);


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

    type TdailyDate = {
        year: number;
        month: number;
        day: number;
    }

    const combineDate = (daily: TdailyDate): string => {
        let dailyDate = daily.year + '-';
        if(daily.month < 10) {
            dailyDate += '0' + daily.month + '-';
        } else {
            dailyDate += daily.month + '-';
        }
        if(daily.day < 10) {
            dailyDate += '0' + daily.day;
        } else {
            dailyDate += daily.day;
        }
        return dailyDate;
    }

    const renderDaily = DailiesData.map((daily, i) => {
        if (daily) {
            let dailyDate = combineDate(daily);
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
                                onClick={handleClick(daily.id)}
                            >
                                <RemoveCircle color='error'/>
                            </IconButton>
                            <Box onClick={toggleDrawer(true, dailyDate)}>
                                <Typography variant="h6" component="div">
                                    {dailyDate}
                                </Typography>
                                <Box>
                                    {daily.events?.map((event, j) => {
                                        return <Typography key={j} variant="body1"> {event.description}</Typography>
                                    })}
                                </Box>
                            </Box>
                        </Card>
                    </Box>
                </Grid>
            );
        }
    });

    const changeYear = (upDown: boolean) =>
        (e: MouseEvent<HTMLButtonElement>) => {
            if(upDown) {
                setCurYearMonth([CurYearMonth[0] + 1, CurYearMonth[1]]);
            } else {
                setCurYearMonth([CurYearMonth[0] - 1, CurYearMonth[1]]);
            }
    };
    const changeMonth = (month: number) => 
        (e: MouseEvent<HTMLButtonElement>) => {
            setCurYearMonth([CurYearMonth[0], month]);
    };
    return (
        <Box>
            <Box sx={{display: 'flex'}}>
                <Box sx={{mr: 3}}>
                    <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="year down"
                            onClick={changeYear(false)}
                    >
                        <ChevronLeftOutlined />
                    </IconButton>
                    <Chip label={CurYearMonth[0]} variant="outlined" sx={{fontSize: 17}} />
                    <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="year up"
                            onClick={changeYear(true)}
                    >
                        <ChevronRightOutlined />
                    </IconButton>
                </Box>
                <ButtonGroup variant="outlined" aria-label="button group">
                    {[...Array(12)].map((v, i) => (
                        <Button
                            variant={CurYearMonth[1] === i+1 ? "contained" : "outlined"}
                            key={i}
                            onClick={changeMonth(i+1)}
                        >
                            {i+1}월
                        </Button>
                    ))}
                    
                </ButtonGroup>
            </Box>
            <Grid style={{display: 'flex', alignItems: 'center'}} container spacing={2}>


                {renderDaily}
                <DailyToggle
                    getDailis={getDailis}
                    setOpenToggle={setOpenToggle}
                    setCurDailyDate={setCurDailyDate}
                    setCurrDaily={setCurrDaily}
                />
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
        </Box>
    );
};

export default Daily