import { ChangeEvent, KeyboardEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Box, Button, Drawer } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers/rootReducer';
import * as type from '../redux/types'
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { api } from '../utils/authInstance';
import { useDispatch } from 'react-redux';
import { setEventsData } from '../redux/actions/eventAction';

type Tprops = {
    setOpenToggle(isOpened: boolean): type.changeDailyToggleAction['openCloseValue'];
    setCurrDaily(daily: any): type.changeDailyToggleAction['CurDailyData'];
}

type TServerData = {
    Success: boolean,
    eventData: {
        id: number;
        description: string;
    }[]
}

function DailyToggle(props: Tprops) {
    const { setOpenToggle, setCurrDaily} = props;

    const Today = dayjs(new Date());
    const [CurrDate, setCurrDate] = useState<Dayjs | null>(Today);
    const [EventText, setEventText] = useState('');

    const {CurrUserData} = useSelector((state: RootState) => state.userReducer);
    const {openCloseValue, CurDailyData} = useSelector((state: RootState) => state.dailyReducer);
    const {EventsData} = useSelector((state: RootState) => state.eventReducer);

    const dispatch = useDispatch();

    const setEvents = useCallback(
        (eventsData: type.eventData[]) => dispatch(setEventsData(eventsData)),
        [dispatch]
    );

    useEffect(() => {
        getEvents();
        console.log('작동1')
        const date = dayjs(CurDailyData?.date)
        setCurrDate(date)
    }, [CurDailyData])

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
                setEventText('');
                updateDaily();
            }
            setOpenToggle(open);
    };

    const createDaily = () => {
        if(!CurrUserData) {
            return;
        }
        let body = {
            users: CurrUserData.id,
            date: CurrDate
        };
        api().post('/dailies', body)
        .then(res => {
        }).catch(Error => {
            console.log(Error);
        });
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
        }).catch(Error => {
            console.log(Error);
        });
    };

    const onEventHandle = (e:ChangeEvent<HTMLInputElement>) => {
        setEventText(e.currentTarget.value)
    }

    const createEvent = () => {
        if(!CurrUserData || !EventText || !CurDailyData) {
            return;
        }
        let body = {
            users: CurrUserData.id,
            dailies: CurDailyData.id,
            description: EventText
        };
        api().post('/events', body)
        .then(res => {
            getEvents();
            setEventText('');
        }).catch(Error => {
            console.log(Error);
        });
    };

    const getEvents = () => {
        if(CurrUserData && CurDailyData){
            api().get<TServerData>(`/events/getEvents/${CurrUserData.id}/${CurDailyData.id}`)
                .then(res => {
                    setEvents(res.data.eventData);
                }).catch(Error => {
                    console.log(Error);
            });
        }
    }
    
    return (
        <Drawer
            anchor='right'
            open={openCloseValue}
            onClose={toggleDrawer(false)}
        >
            <Box
                sx={{ width: 400 }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        // label={"}
                        value={CurrDate}
                        inputFormat="YYYY-MM-DD"
                        mask="____-__-__"
                        onChange={(newValue) => {
                            setCurrDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <div>
                    {EventsData?.map((event, i) => {
                        return (<p key={i}>{event?.description}</p>)
                    })}
                </div>
                <TextField
                    id="eventText"
                    placeholder='입력해주세요.'
                    multiline
                    maxRows={4}
                    value={EventText}
                    onChange={onEventHandle}
                />
                <Button onClick={createEvent}>작성</Button>
                <br/>
                <Button onClick={createDaily}>생성</Button>
                <Button onClick={updateDaily}>수정</Button>
            </Box>
        </Drawer>
    );
};

export default DailyToggle;