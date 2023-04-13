import { useCallback, useState } from 'react';
import { Box, Divider, List, Tab, Tabs } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../redux/reducers/rootReducer';
import * as type from '../../../../redux/types';
import { setEventsData } from '../../../../redux/actions/eventAction';
import '../../../../styles/style.css';
import { api } from '../../../../utils/authInstance';
import Event from './Event';

type TServerEventsData = {
    Success: boolean,
    eventData: {
        id: number;
        title: string;
        description: string | null;
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

    const [CheckValue, setCheckValue] = useState<number>(0);

    const checkValueHandler = (e: React.SyntheticEvent, newValue: number) => {
        console.log(newValue)
        setCheckValue(newValue);
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

    const seletor = ['전체', '완료', '미완료']; // 0: 전체, 1: 완료, 2: 미완료
    const checkValueSelector = (
        <Tabs value={CheckValue} onChange={checkValueHandler} aria-label="basic tabs example" color='info' sx={{padding: 1}}>
            {seletor.map((value, i) => 
                <Tab key={i} label={value} sx={{minWidth: 50, minHeight: 5, padding: 1, fontSize: 12.5}}/>
            )}
        </Tabs>
    );
    
    // 내용 이벤트
    const renderEvent = EventsData.map((event, i) => {
        if(CheckValue === 1 && !event.isChecked) return
        if(CheckValue === 2 && event.isChecked) return
        return (
            <List key={i}>
                <Event eventId={event.id} eventData={event} />
            </List>
        );
    });
    
    return (
        <Box className='toggle_eventlist_box'>
            <Box className='checked_selector_box'>
                {checkValueSelector}
            </Box>
            <Divider />
            <Box className='eventlist_box'>
                {EventsData && renderEvent}
                <Box sx={{mb: 8}}></Box>
            </Box>
        </Box>
    );
};

export default EventList;