import { ChangeEvent, KeyboardEvent, MouseEvent, useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

type Tprops = {
    setOpenToggle(isOpened: boolean): type.changeDailyToggleAction['openCloseValue'];
}

function DailyToggle(props: Tprops) {
    const { setOpenToggle } = props;

    const navigate = useNavigate();

    const Today = dayjs(new Date());
    const [CurrDate, setCurrDate] = useState<Dayjs | null>(Today);
    // const [EventText, setEventText] = useState('');
    const [EventDescs, setEventDescs] = useState<string[]>([]);

    const {CurrUserData} = useSelector((state: RootState) => state.userReducer);
    const {openCloseValue, CurDailyData} = useSelector((state: RootState) => state.dailyReducer);
    



    useEffect(() => {
        if(CurDailyData) {
            const date = dayjs(CurDailyData.date)
            setCurrDate(date)

            if(CurDailyData.events) {
                CurDailyData.events.map((event, i) => {
                    setEventDescs(EventDescs => [...EventDescs, event.description]);
                });
            }
        }
    }, [CurDailyData])


    const toggleDrawer = (open: boolean) => 
        (e: KeyboardEvent | MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as KeyboardEvent).key === 'Tab' ||
                    (e as KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            // if(!CurDailyData) {
            //     createDaily();
            // }
            if(openCloseValue) {
                updateDaily();
                setEventDescs([]);
                setCurrDate(Today);
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
            navigate('/')
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
            navigate('/')
        }).catch(Error => {
            console.log(Error);
        });
    };

    // const onEventHandle = (e:ChangeEvent<HTMLInputElement>) => {
    //     setEventText(e.currentTarget.value)
    // }

    // const createEvent = () => {
    //     setEventDescs(EventDescs => [...EventDescs, EventText]);
    // };
    
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
                    {/* {CurDailyData?.events?.map((event, i) => {
                        return (<p key={i}>{event.description}</p>)
                    })} */}
                    {EventDescs.map((Desc, i) => {
                        return (<p key={i}>{Desc}</p>)
                    })}
                </div>
                {/* <TextField
                    id="eventText"
                    placeholder='입력해주세요.'
                    multiline
                    maxRows={4}
                    onChange={onEventHandle}
                />
                <Button onClick={createEvent}>작성</Button>
                <br/> */}
                <Button onClick={createDaily}>생성</Button>
                <Button onClick={updateDaily}>수정</Button>
            </Box>
        </Drawer>
    );
};

export default DailyToggle;