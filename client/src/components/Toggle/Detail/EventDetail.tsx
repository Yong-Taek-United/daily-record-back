import { ChangeEvent } from 'react';
import { TextField, Box, IconButton } from '@mui/material';
import { KeyboardDoubleArrowUp } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types';
import '../../../styles/style.css';
import { api } from '../../../utils/authInstance';

type Tprops = {
    eventId: number;
    eventData: type.eventData;
    eventDetailCloseHandler: () => void;
}

const EventDetail = (props: Tprops) => {
    const {eventId, eventData, eventDetailCloseHandler} = props

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);

    // 이벤트 디테일 수정
    const updateEventDesc = async(value: string) => {
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

    // 이벤트 디테일 수정 텍스트 업데이트
    const eventDetailUpdateHandler = (e: ChangeEvent<HTMLInputElement>) => {
        updateEventDesc(e.currentTarget.value);
    };

    return (
        <Box className='event_detail_box'>
            <TextField
                fullWidth
                multiline
                rows={4}
                defaultValue={eventData.description}
                onChange={eventDetailUpdateHandler}
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