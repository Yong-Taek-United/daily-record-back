import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Box, IconButton, TextField, List, Button, Checkbox } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types';
import '../../../styles/style.css';
import { api } from '../../../utils/authInstance';
import { useDispatch } from 'react-redux';
import { setEventId, setEventsData } from '../../../redux/actions/eventAction';
import { RemoveCircle } from '@mui/icons-material';
import { setTargetElement } from '../../../redux/actions/dailyAction';

type Tprops = {
    index: number;
    eventId: string;
    eventData: type.eventData;
}

type TServerEventsData = {
    Success: boolean,
    eventData: {
        id: number;
        description: string;
        isChecked: boolean;
    }[]
};

const Event = (props: Tprops) => {
    const {eventId, index, eventData} = props

    const dispatch = useDispatch();

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);
    const {CurDailyData} = useSelector((state: RootState) => state.dailyReducer);
    const {TargetEventId} = useSelector((state: RootState) => state.eventReducer);

    const setTargetEventId = useCallback(
        (eventId: type.eventId) => dispatch(setEventId(eventId)),
        [dispatch]
    );
    const setCurElement = useCallback(
        (targetElement: type.targetElement) => dispatch(setTargetElement(targetElement)),
        [dispatch]
    );
    const setEvents = useCallback(
        (eventsData: type.eventData[]) => dispatch(setEventsData(eventsData)),
        [dispatch]
    );

    const [EventUpdateText, setEventUpdateText] = useState<string>('');
    const [Checked, setChecked] = useState<boolean>(eventData.isChecked);

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

    // 이벤트 체크
    const onEventCheckHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        changeEventCheck();
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

    // 이벤트 체크 수정
    const changeEventCheck = async() => {
        if(!CurUserData || !eventId) {
            return;
        }
        await api().patch(`/events/check/${eventId}`)
        .then(res => {
            getEvents();
        }).catch(Error => {
            console.log(Error);
        });
    };

    useEffect(() => {
        setTimeout(() => {
            updateEvent()
        }, 100);
    }, [EventUpdateText]);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    return (
        <List
            className='eventlist'
            key={index}
            component="nav"
            aria-label="event-list"
            
        >
            <Checkbox 
                {...label} 
                checked={Checked} 
                color="success" 
                onChange={onEventCheckHandler}
            />
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