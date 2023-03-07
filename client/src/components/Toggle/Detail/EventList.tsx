import { ChangeEvent, MouseEvent, useCallback, useEffect, useState } from 'react';
import { Box, IconButton, TextField, List } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types'
import { api } from '../../../utils/authInstance';
import { useDispatch } from 'react-redux';
import { setEventId } from '../../../redux/actions/eventAction';
import { RemoveCircle } from '@mui/icons-material';
import { setTargetElement } from '../../../redux/actions/dailyAction';

const EventList = () => {

    const dispatch = useDispatch();

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);
    const {EventsData, TargetEventId} = useSelector((state: RootState) => state.eventReducer);

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
        console.log(e.currentTarget)
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
            updateEvent()
        }, 100);
    }, [EventUpdateText]);

    const renderEvent = EventsData.map((event, i) => {
        let temporaryId = String(event.id)
        return (
            <List component="nav" aria-label="mailbox folders"
                key={i} 
                sx={{mt: '4px'}}
            >
                <TextField
                    sx={{width: 270}}
                    id={temporaryId}
                    name={temporaryId}
                    variant="standard"
                    defaultValue={event.description}
                    key={event.description}
                    onChange={onEventUpdateHandle}
                />
                <IconButton
                    size="small"
                    color="inherit"
                    aria-label="delete"
                    sx={{ ml: 2}}
                    onClick={popOverOpenHandler(event.id)}
                >
                    <RemoveCircle color='error'/>
                </IconButton>
            </List>
        );
    });

    return (
        <Box
            sx={{mt: 2, height: '60vh'}}
        >
            {EventsData && renderEvent}
        </Box>
    );
};

export default EventList;