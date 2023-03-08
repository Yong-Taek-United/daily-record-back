import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, IconButton, Popover, Typography } from '@mui/material';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import * as type from '../redux/types'
import { RootState } from '../redux/reducers/rootReducer';
import { setDailyId, setTargetElement } from '../redux/actions/dailyAction';
import { setEventId } from '../redux/actions/eventAction';
import { api } from '../utils/authInstance';

type Tprops = {
    deleteTarget: string;
    getTargets: any 
}

const MessagePopover = (props: Tprops) => {
    const {deleteTarget, getTargets} = props;

    const dispatch = useDispatch();

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);
    const {TargetDailyId, TargetElement} = useSelector((state: RootState) => state.dailyReducer);
    const {TargetEventId} = useSelector((state: RootState) => state.eventReducer);
    
    const setTargetDailyId = useCallback(
        (dailyId: type.dailyId) => dispatch(setDailyId(dailyId)),
        [dispatch]
    );
    const setTargetEventId = useCallback(
        (eventId: type.eventId) => dispatch(setEventId(eventId)),
        [dispatch]
    );
    const setCurElement = useCallback(
        (targetElement: type.targetElement) => dispatch(setTargetElement(targetElement)),
        [dispatch]
    );
    
    // 팝오버 닫기
    const popOverCloseHandler = () => {
        setCurElement(null);
    };

    // 데일리 삭제
    const deleteDaily = async() => {
        if(CurUserData && TargetDailyId){
            await api().delete(`/dailies/${TargetDailyId}`)
            .then(res => {
                setTargetDailyId(null);
                popOverCloseHandler();
                getTargets();
            }).catch(Error => {
                console.log(Error);
            });
        }
    };

    // 이벤트 삭제
    const deleteEvent = async() => {
        if(CurUserData && TargetEventId){
            await api().delete(`/events/${TargetEventId}`)
            .then(res => {
                setTargetEventId(null);
                popOverCloseHandler();
                getTargets();
            }).catch(Error => {
                console.log(Error);
            });
        }
    };

    // 삭제 함수 지정
    const deleteTargetHandler = ()=> {
        if(deleteTarget === 'daily') {deleteDaily();}
        if(deleteTarget === 'event') {deleteEvent();}
    }

    const PopOverValue = Boolean(TargetElement);
    const deleteMsgId = PopOverValue ? 'simple-popover' : undefined;

    return (
        <Popover
            className='popover_box'
            id={deleteMsgId}
            open={PopOverValue}
            anchorEl={TargetElement}
            onClose={popOverCloseHandler}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Typography className='popover_message' component='h6'>
                {deleteTarget==='daily' ? '데일리를 삭제하시겠습니까?' : '이벤트를 삭제하시겠습니까?'}
            </Typography>
            <Box className='popover-button-group'>
                <IconButton
                    aria-label="execute-button"
                    onClick={deleteTargetHandler}
                >
                    <CheckCircleOutline color='success' />
                </IconButton>
                <IconButton
                    aria-label="cancel-button"
                    onClick={popOverCloseHandler}
                >
                    <HighlightOff color='error' />
                </IconButton>
            </Box>
        </Popover>
    );
};

export default MessagePopover;