import * as type from '../types';
import { OPEN_DAILYTOGGLE, SET_DAILYDATE, SET_DAILYDATA, SET_DAILIESDATA } from '../actions/dailyAction';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';

export const initialState: type.DAILYREDUCERTYPE= {
    openCloseValue: false,
    CurDailyDate: null,
    CurDailyData: null,
    DailiesData: []
}

const DailyReducer = createReducer<type.DAILYREDUCERTYPE, any>(
    initialState,
    {
        [OPEN_DAILYTOGGLE]: (state, action) =>
            produce(state, (draft) => {
                draft.openCloseValue = action.payload;
        }),
        [SET_DAILYDATE]: (state, action) =>
            produce(state, (draft) => {
                draft.CurDailyDate = action.payload;
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