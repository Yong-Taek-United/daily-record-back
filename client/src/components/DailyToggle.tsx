import { ChangeEvent, FormEvent, KeyboardEvent, MouseEvent, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { Box, Button, Drawer, IconButton, Popover, Typography, TextField, Divider, List, ListItem } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers/rootReducer';
import * as type from '../redux/types'
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { api } from '../utils/authInstance';
import { useDispatch } from 'react-redux';
import { setEventsData } from '../redux/actions/eventAction';
import { CheckCircleOutline, HighlightOff, RemoveCircle } from '@mui/icons-material';

type Tprops = {
    getDailis(): void;
    setOpenToggle(isOpened: boolean): type.dailyActionType['openCloseValue'];
    setCurDailyDate(dailyDate: Dayjs | null): type.dailyActionType['CurDailyDate'];
    setCurrDaily(daily: any): type.dailyActionType['CurDailyData'];
}

type TServerEventData = {
    Success: boolean,
    eventData: {
        id: number;
        description: string;
    }[]
}

type TServerDailyData = {
    Success: boolean,
    dailyData: {
        id: number;
        date: string;
        events: {
            id: number;
            description: string;
        }[] | null
    }
};

function DailyToggle(props: Tprops) {
    const { getDailis, setOpenToggle, setCurDailyDate, setCurrDaily} = props;

    const Today = dayjs();
    // const [CurrDate, setCurrDate] = useState<Dayjs | null>(Today);
    const [EventCeateText, setEventCreateText] = useState('');
    const [EventUpdateText, setEventUpdateText] = useState<string>('');

    const {CurrUserData} = useSelector((state: RootState) => state.userReducer);
    const {openCloseValue, CurDailyDate, CurDailyData} = useSelector((state: RootState) => state.dailyReducer);
    const {EventsData} = useSelector((state: RootState) => state.eventReducer);
    const [CurrEventId, setCurrEventId] = useState<number | null>(null);

    const dispatch = useDispatch();

    const setEvents = useCallback(
        (eventsData: type.eventData[]) => dispatch(setEventsData(eventsData)),
        [dispatch]
    );
    const toggleDrawer = (open: boolean) => 
        (e: KeyboardEvent | MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as KeyboardEvent).key === 'Tab' ||
                    (e as KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            if (openCloseValue) {
                // setCurrDate(Today);
                setCurrDaily(null);
                setEvents([]);
                setEventCreateText('');
                updateDaily();
            }
            setOpenToggle(open);
    };

    const dayjsToString = (data:Dayjs | null) => {
        if(data !== null) {
            return data.format('YYYY-MM-DD');
        }
    };
    const getDailyByDate = async() => {
        await api().get<TServerDailyData>(`/dailies/byDate/${dayjsToString(CurDailyDate)}`)
        .then(res => {
            setCurrDaily(res.data.dailyData);
        }).catch(Error => {
            console.log(Error);
        });
    };
    
    const createDaily = async() => {
        let body = {
            users: CurrUserData?.id,
            date: dayjsToString(CurDailyDate)
        };
        let dailyId: number = 0;
        await api().post<TServerDailyData> ('/dailies', body)
        .then(res => {
            getDailis();
            setCurrDaily(res.data.dailyData);
            dailyId = res.data.dailyData.id;
        }).catch(Error => {
            console.log(Error);
        });
        return dailyId;
    };

    const updateDaily = () => {
        if(!CurrUserData || !CurDailyData) {
            return;
        }
        let body = {
            users: CurrUserData.id,
            // date: dayjsToString(CurrDate)
        };
        api().patch(`/dailies/${CurDailyData.id}`, body)
        .then(res => {
            getDailis();
        }).catch(Error => {
            console.log(Error);
        });
    };
    
    const onEventcreateHandle = (e:ChangeEvent<HTMLInputElement>) => {
        setEventCreateText(e.currentTarget.value)
    }
    const onClickEventUpdateHandle = (e:MouseEvent<HTMLInputElement>) => {
        // setEventUpdateText(e.currentTarget)
        // console.log(e.target)
    }

    const onEventUpdateHandle = (e:ChangeEvent<HTMLInputElement>) => {
        setEventUpdateText(e.currentTarget.value)
        console.log(e.currentTarget)
        let temporaryId = Number(e.currentTarget.name)
        setCurrEventId(temporaryId)
    }

    const getEvents = () => {
        if(CurrUserData && CurDailyData){
            api().get<TServerEventData>(`/events/getEvents/${CurrUserData.id}/${CurDailyData.id}`)
                .then(res => {
                    setEvents(res.data.eventData);
                }).catch(Error => {
                    console.log(Error);
            });
        }
    }

    const createEvent = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        if(!CurrUserData || !data.get('eventCreateText')) {
            return;
        }
        
        let temporaryId = CurDailyData?.id
        if(!CurDailyData) {
            temporaryId= await createDaily();
        } 
        let body = {
            users: CurrUserData.id,
            dailies: temporaryId,
            description: data.get('eventCreateText')
        };
        await api().post('/events', body)
        .then(res => {
            getEvents();
            setEventCreateText('');
        }).catch(Error => {
            console.log(Error);
        });
    };

    const updateEvent = async() => {
        if(!CurrUserData || !CurrEventId) {
            return;
        }
        let body = {
            description: EventUpdateText
        }
        await api().patch(`/events/${CurrEventId}`, body)
        .then(res => {
        }).catch(Error => {
            console.log(Error);
        });
    };

    const [DeleteMsg, setDeleteMsg] = useState<HTMLButtonElement | null>(null);
    const handleClick = (eventId?: number) => (e: MouseEvent<HTMLButtonElement>) => {
        if(eventId) {
            setCurrEventId(eventId);
        }
        setDeleteMsg(e.currentTarget);
    };
    const handleClose = () => {
        setDeleteMsg(null);
    };
    const deleteMsgOpen = Boolean(DeleteMsg);
    const deleteMsgId = deleteMsgOpen ? 'simple-popover' : undefined;

    const deleteEvent = () => {
        if(CurrUserData && CurrEventId){
            api().delete(`/events/${CurrEventId}`)
                .then(res => {
                    setCurrEventId(null);
                    handleClose();
                    getEvents();
                }).catch(Error => {
                    console.log(Error);
            });
        }
    };
    useEffect(() => {
        console.log('데일리 바뀜',CurDailyData)
        setTimeout(() => {
            if(!CurDailyData) {
                setEvents([]);
            }
            getEvents();
            if(!CurDailyData || CurDailyData?.date === dayjsToString(CurDailyDate)) {
                return;
            }
            const date = dayjs(CurDailyData.date)
            setCurDailyDate(date)
        }, 1);
    }, [CurDailyData]);

    useEffect(() => {
        setTimeout(() => {
            updateEvent()
        }, 100);
    }, [EventUpdateText]);

    useEffect(() => {
        console.log('날짜 바뀜',CurDailyDate)
        setTimeout(() => {
            getDailyByDate();
        }, 1);
    }, [CurDailyDate]);
    useEffect(() => {
        console.log('이벤트 바뀜',EventsData)
    }, [EventsData]);

    const renderEvent = EventsData.map((event, i) => {
        // console.log(event.description)
        let temporaryId = String(event.id)
        return (
            <List component="nav" aria-label="mailbox folders"
                key={i} 
                sx={{mt: '4px'}}
            >
                <TextField
                    sx={{width: 270}}
                    id={temporaryId}
                    name={temporaryId}
                    variant="standard"
                    defaultValue={event.description}
                    key={event.description}
                    onChange={onEventUpdateHandle}
                    // onClick={onClickEventUpdateHandle}
                />
                <IconButton
                    size="small"
                    // edge="end"
                    color="inherit"
                    aria-label="delete"
                    sx={{ ml: 2}}
                    onClick={handleClick(event.id)}
                >
                    <RemoveCircle color='error'/>
                </IconButton>
            </List>
        );
    })

    return (
        <Drawer
            anchor='right'
            open={openCloseValue}
            onClose={toggleDrawer(false)}
        >
            <Box 
                sx={{marginTop: 5, display: 'flex', flexDirection: 'column', justifyContent:'center', width: 400}}
            >
            <Box 
                sx={{display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center'}}
            >   

                {/* 일자 선택 */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={CurDailyDate}
                        inputFormat="YYYY-MM-DD"
                        mask="____-__-__"
                        onChange={(newValue) => {
                            setCurDailyDate(newValue);
                        }}
                        renderInput={(params) => <TextField sx={{width: 300}} {...params} />}
                    />
                </LocalizationProvider>

                {/* 이벤트 리스트 */}
                <Box
                    sx={{mt: 2, height: '60vh'}}
                >
                    {EventsData && renderEvent}
                </Box>

                <Divider />

                {/* 이벤트 생성란 */}
                <Box 
                    component="form" 
                    onSubmit={createEvent}
                    sx={{display: 'flex', alignItems: 'center'}}
                >
                    <TextField
                        required
                        type="text"
                        id="eventCreateText"
                        name="eventCreateText"
                        placeholder='입력해주세요.'
                        value={EventCeateText}
                        onChange={onEventcreateHandle}
                        size="small"
                        sx={{width: 240}}
                    />
                    <Button 
                        type="submit" 
                        variant="contained"
                        sx={{ml: 1}}
                    >
                        작성
                    </Button>
                </Box>
            </Box>
            </Box>
            
            {/* 이벤트 삭제 메세지창 */}
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
                <Typography fontSize={15} sx={{ p: 2 }}>이벤트를 삭제하시겠습니까?</Typography>
                <Box>
                    <IconButton
                        size="small"
                        // edge="end"
                        color="inherit"
                        aria-label="execute"
                        sx={{ mr: 1 }}
                        onClick={deleteEvent}
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
        </Drawer>
    );
};

export default DailyToggle;