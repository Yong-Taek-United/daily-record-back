import { KeyboardEvent, MouseEvent, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Grid, Card, IconButton, Typography} from '@mui/material';
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

    // 자리 메우기 카드
    const xCard = (
        <Card sx={{width: 130, height: 80, margin: 0, backgroundColor: '#ededed'}} elevation={3}>
        </Card>
    );

    // 데일리 카드
    const dailyCard = dailyDate && dailyData && (
        <Card sx={{width: 130, height: 80, margin: 0}} elevation={3}>
            <IconButton
                size="small"
                color="inherit"
                aria-label="delete"
                sx={{ mr: 2}}
                onClick={popOverOpenHandler(dailyData.id)}
            >
                <RemoveCircle color='error'/>
            </IconButton>
            <Box onClick={toggleHandler(true, dailyDate)}>
                <Typography variant="h6" component="div">
                    {dailyData.day}
                </Typography>
                <Box>
                    {dailyData.events && dailyData.events.map((event, i) => {
                        return <Typography key={i} variant="body1"> {event.description}</Typography>
                    })}
                </Box>
            </Box>
        </Card>
    );
    
    // 데일리 빈 카드
    const emptyCard = dailyDate && (
        <Card sx={{width: 130, height: 80, margin: 0, backgroundColor: '#ededed'}} elevation={3}>
            <AddCircle color="success" />
            <Box onClick={toggleHandler(true, dailyDate)}>
                <Typography variant="h6" component="div">
                    {index}
                </Typography>
            </Box>
        </Card>
    );

    return (
        <Grid item xs={12/7} key={index}>
            <Box>
                {!dailyDate ? xCard : dailyData ? dailyCard : emptyCard}
            </Box>
        </Grid>
    );
};

export default DailyCard;