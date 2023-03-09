import { KeyboardEvent, MouseEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Grid, Card, IconButton, Typography, Divider, CardHeader, CardContent} from '@mui/material';
import { RemoveCircle, AddCircle } from '@mui/icons-material';
import dayjs from 'dayjs';
import * as type from '../../redux/types'
import { OpenDailyToggle, setDailyDate, setDailyId, setTargetElement } from '../../redux/actions/dailyAction';

type Tprops = {
    index: number;
    dailyDate?: string;
    dailyData?: type.dailyData;
}

const DailyCard = (props: Tprops) => {
    const {dailyData, index, dailyDate} = props

    const dispatch = useDispatch();

    const setToggleValue = useCallback(
        (isOpened: type.isOpened) => dispatch(OpenDailyToggle(isOpened)),
        [dispatch]
    );
    const setCurDailyDate = useCallback(
        (dailyDate: type.dailyDate) => dispatch(setDailyDate(dailyDate)),
        [dispatch]
    );
    const setTargetDailyId = useCallback(
        (dailyId: type.dailyId) => dispatch(setDailyId(dailyId)),
        [dispatch]
    );
    const setCurElement = useCallback(
        (targetElement: type.targetElement) => dispatch(setTargetElement(targetElement)),
        [dispatch]
    );

    // 데일리 토글 열기/닫기
    const toggleHandler = (open: boolean, dailyDate: string) => 
        (e: KeyboardEvent | MouseEvent) => {
            if(e.type === 'keydown' && (
                (e as KeyboardEvent).key === 'Tab' ||
                    (e as KeyboardEvent).key === 'Shift'
            )) {
            return;
            }

            // 데일리 삭제 시, 토글 오픈 방지
            const targetTagName = (e.target as HTMLInputElement).tagName
            if(targetTagName === 'path') {
                return
            };
            setCurDailyDate(dayjs(dailyDate));
            setToggleValue(open);
    };

    // 팝오버 열기
    const popOverOpenHandler = (dailyId: number) => 
        (e: MouseEvent<HTMLButtonElement>) => {
            if(dailyId) {
                setTargetDailyId(dailyId);
            }
            setCurElement(e.currentTarget);
    };

    // 카드 렌더링
    const lenderCard = dailyDate ? (

        // 데일리 카드
        <Card sx={dailyData && {backgroundColor: '#fff'}} onClick={toggleHandler(true, dailyDate)}>
            <Box className='card_header'>
                {dailyData ? 
                    <IconButton aria-label="delete-daily-button" onClick={popOverOpenHandler(dailyData.id)}>
                        <RemoveCircle color='error' />
                    </IconButton>
                :
                    <IconButton aria-label="create-daily-button" disabled>
                        <AddCircle color="success" />
                    </IconButton>
                }
                <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'end'}} >
                    {dailyData ? dailyData.day : index} 일
                </Typography>
            </Box>
            <Divider />
            <CardContent>
                {dailyData && dailyData.events && 
                    <Typography variant="body1" sx={{whiteSpace: 'nowrap'}}>{dailyData.events[0].description}</Typography>
                }
                {dailyData && dailyData.events && dailyData.events.length > 1 && 
                    <Typography variant="body2"> 그 외 {dailyData.events.length-1}개...</Typography>
                }
            </CardContent>
        </Card>
    ) : (

        // 빈 카드
        <Card>
        </Card>
    );

    return (
        <Box>
            {lenderCard}
        </Box>
    );
};

export default DailyCard;