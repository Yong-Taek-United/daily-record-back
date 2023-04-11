import { KeyboardEvent, MouseEvent, useCallback } from 'react';
import { Drawer } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers/rootReducer';
import * as type from '../../redux/types'
import { api } from '../../utils/authInstance';
import { useDispatch } from 'react-redux';
import { setEventId, setEventsData } from '../../redux/actions/eventAction';
import { OpenDailyToggle, setDailyData } from '../../redux/actions/dailyAction';
import MessagePopover from '../PopOver';
import DailyDetail from './Detail/Detail';

type TServerEventsData = {
    Success: boolean,
    eventData: {
        id: number;
        description: string;
        isChecked: boolean;
    }[]
};

const DailyToggle = () => {
    const {CurUserData} = useSelector((state: RootState) => state.userReducer);
    const {ToggleValue, CurDailyData} = useSelector((state: RootState) => state.dailyReducer);

    const dispatch = useDispatch();

    const setToggleValue = useCallback(
        (isOpened: type.isOpened) => dispatch(OpenDailyToggle(isOpened)),
        [dispatch]
    );
    const setCurDaily = useCallback(
        (daily: type.dailyData) => dispatch(setDailyData(daily)),
        [dispatch]
    );
    const setEvents = useCallback(
        (eventsData: type.eventData[]) => dispatch(setEventsData(eventsData)),
        [dispatch]
    );
    const setTargetEventId = useCallback(
        (eventId: type.eventId) => dispatch(setEventId(eventId)),
        [dispatch]
    );

    // 데일리 토글 열기/닫기
    const toggleHandler = (open: boolean) => 
        (e: KeyboardEvent | MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as KeyboardEvent).key === 'Tab' ||
                    (e as KeyboardEvent).key === 'Shift'
            )) {
            return;
            }
            if (ToggleValue) {
                setCurDaily(null);
                setEvents([]);
                setTargetEventId(null)
                // updateDaily();
            }
            setToggleValue(open);
    };


    // 데일리 수정
    // const updateDaily = () => {
    //     if(!CurrUserData || !CurDailyData) {
    //         return;
    //     }
    //     let body = {
    //         users: CurrUserData.id,
    //     };
    //     api().patch(`/dailies/${CurDailyData.id}`, body)
    //     .then(res => {
    //         getDailis();
    //     }).catch(Error => {
    //         console.log(Error);
    //     });
    // };

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

    return (
        <Drawer
            anchor='right'
            open={ToggleValue}
            onClose={toggleHandler(false)}
        >
            {/* 데일리 디테일 */}
            <DailyDetail />
            
            {/* 이벤트 삭제 메세지창 */}
            <MessagePopover deleteTarget='event' getTargets={getEvents} />
        </Drawer>
    );
};

export default DailyToggle;