import { ChangeEvent, MouseEvent, useCallback, useState } from 'react';
import { IconButton, TextField, Checkbox, ListItem } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types';
import '../../../styles/style.css';
import { api } from '../../../utils/authInstance';
import { setTargetElement } from '../../../redux/actions/dailyAction';
import { setEventId, setEventsData } from '../../../redux/actions/eventAction';
import { RemoveCircle } from '@mui/icons-material';

type Tprops = {
    eventId: number;
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
    const {eventId, eventData} = props

    const dispatch = useDispatch();

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);
    const {CurDailyData} = useSelector((state: RootState) => state.dailyReducer);

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

    const [Checked, setChecked] = useState<boolean>(eventData.isChecked);

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
    const updateEvent = async(value: string) => {
        if(!CurUserData || !eventId) {
            return;
        }
        let body = {
            description: value
        }
        await api().patch(`/events/${eventId}`, body)
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

    // 이벤트 수정 텍스트 업데이트
    const eventUpdateHandler = (e: ChangeEvent<HTMLInputElement>) => {
        updateEvent(e.currentTarget.value);
    };

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    return (
        <ListItem
            className='eventlist'
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
                variant="standard"
                defaultValue={eventData.description}
                key={eventData.description}
                onChange={eventUpdateHandler}
            />
            <IconButton
                aria-label="delete-event-button"
                sx={{ ml: 2}}
                onClick={popOverOpenHandler(eventData.id)}
            >
                <RemoveCircle color='error'/>
            </IconButton>
        </ListItem>
    );
};

export default Event;