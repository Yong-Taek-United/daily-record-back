import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Card } from '@mui/material';
import dayjs from 'dayjs';
import * as type from '../../redux/types'
import { RootState } from '../../redux/reducers/rootReducer';
import { setDailiesData } from '../../redux/actions/dailyAction';
import '../../styles/style.css'
import { api } from '../../utils/authInstance';
import DailySelector from './Selector';
import DailyCard from './Card';
import MessagePopover from '../PopOver';

type TServerDailiesData = {
    Success: boolean,
    dailyData: {
        id: number;
        year: number;
        month: number;
        day: number;
        events: {
            id: number;
            description: string;
        }[];
    }[];
};

const DailyBoard = () => {
    const dispatch = useDispatch();

    const {CurUserData} = useSelector((state: RootState) => state.userReducer);
    const {DailiesData, CurYearMonth} = useSelector((state: RootState) => state.dailyReducer);

    const setDailies = useCallback(
        (dailiesData: type.dailyData[]) => dispatch(setDailiesData(dailiesData)),
        [dispatch]
    );

    // 데일리 전체 조회
    const getDailis = () => {
        if(CurUserData){
            api().get<TServerDailiesData>(`/dailies/getDailies/${CurUserData.id}/${CurYearMonth[0]}/${CurYearMonth[1]}`)
                .then(res => {
                    setDailies(res.data.dailyData);
                }).catch(Error => {
                    console.log(Error);
            });
        }
    };

    useEffect(() => {
        getDailis();
    }, [CurUserData, CurYearMonth]);

    // 연-월-일 합치기
    const combineDate = (year:number, month:number, day:number): string => {
        let dailyDate = year + '-';
        if(month < 10) {
            dailyDate += '0' + month + '-';
        } else {
            dailyDate += month + '-';
        }
        if(day < 10) {
            dailyDate += '0' + day;
        } else {
            dailyDate += day;
        }
        return dailyDate;
    }

    const CurMonth = `${CurYearMonth[0]}-${CurYearMonth[1]}`;
    const daysOfMonth = dayjs(CurMonth).daysInMonth();
    const firstDayOfMonth = dayjs(`${CurMonth}-1`).get("day");
    const constCards = daysOfMonth + firstDayOfMonth
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    
    // 요일 형식 카드
    const renderDays = days.map((v, i) => {
        return (
            <Grid item xs={12/7} key={i}>
                <Box>
                    <Card elevation={1}>
                        <Box sx={{color: '#ffffff', fontSize: 15, fontWeight: 800}}>{v}요일</Box>
                    </Card>
                </Box>
            </Grid>
        );
    });

    // 내용 카드
    const renderCard = [...Array(constCards)].map((v, i): JSX.Element =>{

        const index = i-firstDayOfMonth+1
        if(index <= 0) {
            return (
                <DailyCard index={index}/>
            );
        }

        const daily = DailiesData.find((daily, j): boolean | undefined => {
            if (daily) {
                return index === daily.day;
            }
        });

        if(!daily) {
            const dailyDate = combineDate(CurYearMonth[0], CurYearMonth[1], index);
            return (
                <DailyCard index={index} dailyDate={dailyDate} />
            );
        } else {
            const dailyDate = combineDate(daily.year, daily.month, daily.day);
            return (
                <DailyCard index={index} dailyDate={dailyDate} dailyData={daily} />
            );
        }
    });

    return (
        <Box className='board_area'>
                
            {/* 연/월 조절기 */}
            <DailySelector />

            {/* 데일리 카드 렌더링 */}
            <Box className='card_box'>
                <Grid container spacing={2}>
                    {renderDays}
                    {renderCard}
                </Grid>
            </Box>

            {/* 데일리 삭제 메세지창 */}
            <MessagePopover deleteTarget='daily' getTargets={getDailis} />
        </Box>
    );
};

export default DailyBoard;