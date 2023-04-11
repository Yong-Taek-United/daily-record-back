import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Box, IconButton, TextField, List, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types';
import '../../../styles/style.css';
import { api } from '../../../utils/authInstance';
import { useDispatch } from 'react-redux';
import { setEventId } from '../../../redux/actions/eventAction';
import { RemoveCircle } from '@mui/icons-material';
import { setTargetElement } from '../../../redux/actions/dailyAction';

type Tprops = {
    index: number;
    eventId: string;
    eventData: type.eventData;
    checkValue: any;
}

const Event = (props: Tprops) => {
    const {eventId, index, eventData, checkValue} = props

    const dispatch = useDispatch();

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);
    const {TargetEventId} = useSelector((state: RootState) => state.eventReducer);

    const setTargetEventId = useCallback(
        (eventId: type.eventId) => dispatch(setEventId(eventId)),
        [dispatch]
    );
    const setCurElement = useCallback(
        (targetElement: type.targetElement) => dispatch(setTargetElement(targetElement)),
        [dispatch]
    );

    const [EventUpdateText, setEventUpdateText] = useState<string>('');

    // 이벤트 수정 텍스트 업데이트
    const onEventUpdateHandle = (e: ChangeEvent<HTMLInputElement>) => {
        setEventUpdateText(e.currentTarget.value)
        let temporaryId = Number(e.currentTarget.name)
        setTargetEventId(temporaryId)
    };

    // 팝오버 열기
    const popOverOpenHandler = (eventId: number) => 
        (e: MouseEvent<HTMLButtonElement>) => {
            if(eventId) {
                setTargetEventId(eventId);
            }
            setCurElement(e.currentTarget);
    };

    // 이벤트 수정
    const updateEvent = async() => {
        if(!CurUserData || !TargetEventId) {
            return;
        }
        let body = {
            description: EventUpdateText
        }
        await api().patch(`/events/${TargetEventId}`, body)
        .then(res => {
        }).catch(Error => {
            console.log(Error);
        });
    };

    useEffect(() => {
        setTimeout(() => {
            console.log(checkValue)
        }, 100);
    }, [checkValue]);

    useEffect(() => {
        setTimeout(() => {
            updateEvent()
        }, 100);
    }, [EventUpdateText]);

    return (
        <List
            className='eventlist'
            key={index}
            component="nav"
            aria-label="event-list"
            
        >
            <TextField
                sx={{width: 270}}
                id={eventId}
                name={eventId}
                variant="standard"
                defaultValue={eventData.description}
                key={eventData.description}
                onChange={onEventUpdateHandle}
            />
            <IconButton
                aria-label="delete-event-button"
                sx={{ ml: 2}}
                onClick={popOverOpenHandler(eventData.id)}
            >
                <RemoveCircle color='error'/>
            </IconButton>
        </List>
    );
};

export default Event;