import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { TextField, Checkbox, ListItem, Box, IconButton } from '@mui/material';
import { KeyboardDoubleArrowUp } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types';
import '../../../styles/style.css';
import { api } from '../../../utils/authInstance';
import { setEventsData } from '../../../redux/actions/eventAction';
import IconMenu from './IconMenu';

type Tprops = {
    eventDetailCloseHandler: () => void;
}


const EventDetail = (props: Tprops) => {
    const {eventDetailCloseHandler} = props

    return (
        <Box className='event_detail_box'>
            <TextField
                fullWidth
                multiline
                rows={4}
            />
            <IconButton
                sx={{ml: 0.7}}
                aria-label="delete-event-button"
                onClick={eventDetailCloseHandler}
            >
                <KeyboardDoubleArrowUp />
            </IconButton>
        </Box>
    );
};

export default EventDetail;