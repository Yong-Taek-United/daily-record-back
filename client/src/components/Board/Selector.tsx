import { MouseEvent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, IconButton, ButtonGroup, Button, Chip} from '@mui/material';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@mui/icons-material';
import * as type from '../../redux/types'
import { RootState } from '../../redux/reducers/rootReducer';
import { setYearMonth } from '../../redux/actions/dailyAction';

const DailySelector = () => {
    const dispatch = useDispatch();

    const {CurYearMonth} = useSelector((state: RootState) => state.dailyReducer);

    const setCurYearMonth = useCallback(
        (yearMonth: type.yearMonth) => dispatch(setYearMonth(yearMonth)),
        [dispatch]
    );

    const changeYearHandler = (upDown: boolean) =>
        (e: MouseEvent<HTMLButtonElement>) => {
            upDown ?
            setCurYearMonth([CurYearMonth[0] + 1, CurYearMonth[1]])
                : setCurYearMonth([CurYearMonth[0] - 1, CurYearMonth[1]])
    };
    const changeMonthHandler = (month: number) => 
        (e: MouseEvent<HTMLButtonElement>) => {
            setCurYearMonth([CurYearMonth[0], month]);
    };

    const renderMonthBottons = [...Array(12)].map((v, i) => (
        <Button
            key={i}
            variant={CurYearMonth[1] === i+1 ? "contained" : "outlined"}
            onClick={changeMonthHandler(i+1)}
        >
            {i+1}월
        </Button>
    ));

    return (
        <Box className='select_box'>
            <Box className='select_year_group'>
                <IconButton
                        aria-label="year-down"
                        onClick={changeYearHandler(false)}
                >
                    <ChevronLeftOutlined />
                </IconButton>
                <Chip label={CurYearMonth[0]} variant="outlined"/>
                <IconButton
                        aria-label="year-up"
                        onClick={changeYearHandler(true)}
                >
                    <ChevronRightOutlined />
                </IconButton>
            </Box>
            <ButtonGroup variant="outlined" aria-label="button-group">
                {renderMonthBottons}
            </ButtonGroup>
        </Box>
    );
};

export default DailySelector;