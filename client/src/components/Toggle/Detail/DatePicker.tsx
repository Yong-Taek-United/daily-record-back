import { useCallback } from 'react';
import { TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import * as type from '../../../redux/types'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch } from 'react-redux';
import { setDailyDate } from '../../../redux/actions/dailyAction';

const DailyDatePicker = () => {

    const dispatch = useDispatch();

    const {CurDailyDate} = useSelector((state: RootState) => state.dailyReducer);

    const setCurDailyDate = useCallback(
        (dailyDate: type.dailyDate) => dispatch(setDailyDate(dailyDate)),
        [dispatch]
    );

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
                value={CurDailyDate}
                inputFormat="YYYY-MM-DD"
                mask="____-__-__"
                onChange={(newValue) => {
                    setCurDailyDate(newValue);
                }}
                renderInput={(params) => <TextField sx={{width: 300}} {...params} />}
            />
        </LocalizationProvider>
    );
};

export default DailyDatePicker;