import { useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types'
import { Dayjs } from 'dayjs';
import '../../../styles/style.css';
import { api } from '../../../utils/authInstance';
import { useDispatch } from 'react-redux';
import { setEventsData } from '../../../redux/actions/eventAction';
import { setDailyData } from '../../../redux/actions/dailyAction';
import DailyDatePicker from './DatePicker';
import EventList from './EventList';
import CreateEvent from './Create';

type TServerDailyData = {
    Success: boolean,
    dailyData: {
        id: number;
        year: number;
        month: number;
        day: number;
        events: {
            id: number;
            description: string;
        }[] | null
    };
};

const DailyDetail = () => {

    const dispatch = useDispatch();

    const {CurDailyDate} = useSelector((state: RootState) => state.dailyReducer);

    const setCurDaily = useCallback(
        (daily: type.dailyData) => dispatch(setDailyData(daily)),
        [dispatch]
    );
    const setEvents = useCallback(
        (eventsData: type.eventData[]) => dispatch(setEventsData(eventsData)),
        [dispatch]
    );

    // 연-월-일 포멧
    const divideDate = (data: Dayjs | null) => {
        if(data !== null) {
            let date = {
                year: Number(data.format('YYYY')),
                month: Number(data.format('MM')),
                day: Number(data.format('DD'))
            };
        return date;
        }
    };

    // 데일리 조회(by date)
    const getDailyByDate = async() => {
        const date = divideDate(CurDailyDate);
        if(date) {
            await api().get<TServerDailyData>(`/dailies/byDate/${date.year}/${date.month}/${date.day}`)
            .then(res => {
                setCurDaily(res.data.dailyData);
            }).catch(Error => {
                console.log(Error);
            });
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setEvents([]);
            getDailyByDate();
        }, 1);
    }, [CurDailyDate]);

    return (
        <Box className='toggle_detail_area'>
            <Box className='toggle_detail_box'>
                
                {/* 일자 선택 */}
                <DailyDatePicker />

                {/* 이벤트 리스트 */}
                <EventList />

                {/* 이벤트 생성란 */}
                <CreateEvent />
            </Box>
        </Box>
    );
};

export default DailyDetail;