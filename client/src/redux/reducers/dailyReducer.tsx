import { createReducer } from 'typesafe-actions';
import produce from 'immer';
import dayjs from 'dayjs';
import * as type from '../types';
import { OPEN_DAILYTOGGLE, SET_DAILYDATE, SET_DAILYDATA, SET_DAILIESDATA, SET_DAILYID, SET_TARGETELEMENT, SET_YEARMONTH } from '../actions/dailyAction';

const Year = Number(dayjs().format('YYYY'));
const Month = Number(dayjs().format('MM'));

export const initialState: type.DAILYREDUCERTYPE= {
    ToggleValue: false,
    TargetElement: null,
    CurYearMonth: [Year, Month],
    CurDailyDate: null,
    TargetDailyId: null,
    CurDailyData: null,
    DailiesData: [],
}

const DailyReducer = createReducer<type.DAILYREDUCERTYPE, type.dailyActionType>(
    initialState,
    {
        [OPEN_DAILYTOGGLE]: (state, action) =>
            produce(state, (draft) => {
                draft.ToggleValue = action.payload;
        }),
        [SET_TARGETELEMENT]: (state, action) =>
            produce(state, (draft) => {
                draft.TargetElement = action.payload;
        }),
        [SET_YEARMONTH]: (state, action) =>
            produce(state, (draft) => {
                draft.CurYearMonth = action.payload;
        }),
        [SET_DAILYDATE]: (state, action) =>
            produce(state, (draft) => {
                draft.CurDailyDate = action.payload;
        }),
        [SET_DAILYID]: (state, action) =>
            produce(state, (draft) => {
                draft.TargetDailyId = action.payload;
        }),
        [SET_DAILYDATA]: (state, action) =>
            produce(state, (draft) => {
                draft.CurDailyData = action.payload;
        }),
        [SET_DAILIESDATA]: (state, action) =>
            produce(state, (draft) => {
                draft.DailiesData = action.payload;
        }),
    }
)

export default DailyReducer;