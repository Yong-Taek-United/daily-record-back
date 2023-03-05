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
    setOpenToggle(isOpened: boolean): type.changeDailyToggleAction['openCloseValue'];
    setCurrDaily(daily: any): type.changeDailyToggleAction['CurDailyData'];
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
    const { getDailis, setOpenToggle, setCurrDaily} = props;

    const Today = dayjs(new Date());
    const [CurrDate, setCurrDate] = useState<Dayjs | null>(Today);
    const [EventCeateText, setEventCreateText] = useState('');
    const [EventUpdateText, setEventUpdateText] = useState<string>('');

    const {CurrUserData} = useSelector((state: RootState) => state.userReducer);
    const {openCloseValue, CurDailyData} = useSelector((state: RootState) => state.dailyReducer);
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
                setCurrDate(Today);
                setCurrDaily(null);
                setEvents([]);
                setEventCreateText('');
                updateDaily();
            }
            setOpenToggle(open);
    };

    const createDaily = async() => {
        let body = {
            users: CurrUserData?.id,
            date: CurrDate
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
            date: CurrDate
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
    const onEventUpdateHandle = (e:ChangeEvent<HTMLInputElement>) => {
        setEventUpdateText(e.currentTarget.value)
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
        console.log(data.get('eventCreateText'))
        if(!CurrUserData || !data.get('eventCreateText')) {
            console.log('시발')
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
        setTimeout(() => {
            getEvents();
            const date = dayjs(CurDailyData?.date)
            setCurrDate(date)
        }, 1);
    }, [CurDailyData]);

    useEffect(() => {
        setTimeout(() => {
            updateEvent()
        }, 100);
    }, [EventUpdateText]);

    const renderEvent = EventsData && EventsData.map((event, i) => {
        let temporaryId = String(event.id)
        return (
            <List component="nav" aria-label="mailbox folders"
                key={i} 
                sx={{mt: '4px'}}
            >
                <TextField
                    sx={{width: 270}}
                    id=""
                    name={temporaryId}
                    variant="standard"
                    defaultValue={event.description}
                    onChange={onEventUpdateHandle}
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
                        value={CurrDate}
                        inputFormat="YYYY-MM-DD"
                        mask="____-__-__"
                        onChange={(newValue) => {
                            setCurrDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

                {/* 이벤트 리스트 */}
                <Box
                    sx={{mt: 2, height: '60vh'}}
                >
                    {renderEvent}
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