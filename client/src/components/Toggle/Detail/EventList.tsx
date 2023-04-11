import { MouseEvent, useCallback, useState } from 'react';
import { Box, Button, List } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types';
import { setEventsData } from '../../../redux/actions/eventAction';
import '../../../styles/style.css';
import { api } from '../../../utils/authInstance';
import Event from './Event';

type TServerEventsData = {
    Success: boolean,
    eventData: {
        id: number;
        description: string;
        isChecked: boolean;
    }[]
};

const EventList = () => {

    const dispatch = useDispatch();

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);
    const {CurDailyData} = useSelector((state: RootState) => state.dailyReducer);
    const {EventsData} = useSelector((state: RootState) => state.eventReducer);

    const setEvents = useCallback(
        (eventsData: type.eventData[]) => dispatch(setEventsData(eventsData)),
        [dispatch]
    );

    const [CheckValue, setCheckValue] = useState<string>('전체');

    // 이벤트 체크 분류 조회 핸들러
    const checkValueHandler = (value: string) =>
        (e: MouseEvent<HTMLButtonElement>) => {
            setCheckValue(value);
            getEvents();
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

    // 이벤트 체크 분류 조회 버튼
    const seletor = ['전체', '완료', '미완료'];
    const checkValueSelector = (
        <Box>
            {seletor.map((value, i) => 
                <Button key={i} variant={"contained"} onClick={checkValueHandler(value)}>
                    {value}
                </Button>
            )}
        </Box>
    );
    
    // 내용 이벤트
    const renderEvent = EventsData.map((event, i) => {
        if(CheckValue === '완료' && !event.isChecked) return
        if(CheckValue === '미완료' && event.isChecked) return
        return (
            <List key={i}>
                <Event eventId={event.id} eventData={event} />
            </List>
        );
    });
    
    return (
        <Box className='toggle_eventlist_box'>
            {checkValueSelector}
            {EventsData && renderEvent}
        </Box>
    );
};

export default EventList;