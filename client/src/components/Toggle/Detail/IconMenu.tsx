import { MouseEvent, useCallback } from 'react';
import { IconButton, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import * as type from '../../../redux/types';
import '../../../styles/style.css';
import { setTargetElement } from '../../../redux/actions/dailyAction';
import { setEventId } from '../../../redux/actions/eventAction';
import { RemoveCircle, NextPlan } from '@mui/icons-material';

type Tprops = {
    eventId: number;
}

const IconMenu = (props: Tprops) => {
    const {eventId} = props

    const dispatch = useDispatch();

    const setTargetEventId = useCallback(
        (eventId: type.eventId) => dispatch(setEventId(eventId)),
        [dispatch]
    );
    const setCurElement = useCallback(
        (targetElement: type.targetElement) => dispatch(setTargetElement(targetElement)),
        [dispatch]
    );

    // 팝오버 열기
    const popOverOpenHandler = (eventId: number) => 
        (e: MouseEvent<HTMLButtonElement>) => {
            if(eventId) {
                setTargetEventId(eventId);
            }
            setCurElement(e.currentTarget);
    };

    return (
        <Box className='event_iconmenu_box'>
            <IconButton
                aria-label="delete-event-button"
            >
                <NextPlan color='secondary' />
            </IconButton>
            <IconButton
                aria-label="delete-event-button"
                onClick={popOverOpenHandler(eventId)}
            >
                <RemoveCircle color='error'/>
            </IconButton>
        </Box>
    );
};

export default IconMenu;