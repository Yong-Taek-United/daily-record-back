import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types'
import { Dayjs } from 'dayjs';
import '../../../styles/style.css';
import { api } from '../../../utils/authInstance';
import { useDispatch } from 'react-redux';
import { setEventsData } from '../../../redux/actions/eventAction';
import { setDailyData } from '../../../redux/actions/dailyAction';

type TServerEventsData = {
    Success: boolean,
    eventData: {
        id: number;
        description: string;
        isChecked: boolean;
    }[]
};

type TServerDailyData = {
    Success: boolean,
    dailyData: {
        id: number;
        year: number;
        month: number;
        day: number;
        events: {
            id: number;
            description: string;
        }[] | null
    };
};

const CreateEvent = () => {

    const dispatch = useDispatch();

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);
    const {CurDailyDate, CurDailyData} = useSelector((state: RootState) => state.dailyReducer);

    const setCurDaily = useCallback(
        (daily: type.dailyData) => dispatch(setDailyData(daily)),
        [dispatch]
    );
    const setEvents = useCallback(
        (eventsData: type.eventData[]) => dispatch(setEventsData(eventsData)),
        [dispatch]
    );

    const [EventCeateText, setEventCreateText] = useState('');

    // 이벤트 생성 텍스트 업데이트
    const onEventcreateHandle = (e: ChangeEvent<HTMLInputElement>) => {
        setEventCreateText(e.currentTarget.value)
    };

    // 연-월-일 포멧
    const divideDate = (data: Dayjs | null) => {
        if(data !== null) {
            let date = {
                year: Number(data.format('YYYY')),
                month: Number(data.format('MM')),
                day: Number(data.format('DD'))
            };
        return date;
        }
    };

    // 데일리 생성
    const createDaily = async() => {
        const date = divideDate(CurDailyDate);
        if(date) {
            let body = {
                users: CurUserData?.id,
                year: date.year,
                month: date.month,
                day: date.day
            };
            let dailyId: number = 0;
            await api().post<TServerDailyData>('/dailies', body)
            .then(res => {
                setCurDaily(res.data.dailyData);
                dailyId = res.data.dailyData.id;
            }).catch(Error => {
                console.log(Error);
            });
            return dailyId;
        }
    };

    // 이벤트 전체 조회
    const getEvents = async() => {
        if(CurUserData && CurDailyData){
            await api().get<TServerEventsData>(`/events/getEvents/${CurUserData.id}/${CurDailyData.id}`)
            .then(res => {
                setEvents(res.data.eventData);
            }).catch(Error => {
                console.log(Error);
            });
        }
    };

    // 이벤트 생성
    const createEvent = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        if(!CurUserData || !data.get('eventCreateText')) {
            return;
        }
        let temporaryId = CurDailyData?.id
        if(!CurDailyData) {
            temporaryId= await createDaily();
        } 
        let body = {
            users: CurUserData.id,
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

    useEffect(() => {
        setTimeout(() => {
            getEvents();
        }, 100);
    }, [CurDailyData]);

    return (
        <Box
            className='toggle_create_box'
            component="form" 
            onSubmit={createEvent}
        >
            <TextField
                type="text"
                id="eventCreateText"
                name="eventCreateText"
                placeholder='내용을 입력해주세요.'
                value={EventCeateText}
                onChange={onEventcreateHandle}
            />
            <Button 
                type="submit" 
                variant="contained"
                sx={{ml: 1}}
            >
                입력
            </Button>
        </Box>
    );
};

export default CreateEvent;