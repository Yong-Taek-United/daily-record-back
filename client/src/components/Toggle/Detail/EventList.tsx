import { MouseEvent, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import '../../../styles/style.css';
import Event from './Event';

const EventList = () => {

    const {EventsData} = useSelector((state: RootState) => state.eventReducer);

    const [CheckValue, setCheckValue] = useState<string>('전체');

    const checkValueHandler = (value: string) =>
        (e: MouseEvent<HTMLButtonElement>) => {
            setCheckValue(value);
    };

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
    
    const renderEvent = EventsData.map((event, i) => {
        if(CheckValue === '완료' && !event.isChecked) return
        if(CheckValue === '미완료' && event.isChecked) return
        let temporaryId = String(event.id)
        return (
            <Event index={i} eventId={temporaryId} eventData={event} />
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