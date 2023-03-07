import { createReducer } from 'typesafe-actions';
import produce from 'immer';
import * as type from '../types';
import { OPEN_DAILYTOGGLE, SET_DAILYDATE, SET_DAILYDATA, SET_DAILIESDATA } from '../actions/dailyAction';

export const initialState: type.DAILYREDUCERTYPE= {
    ToggleValue: false,
    CurDailyDate: null,
    CurDailyData: null,
    DailiesData: []
}

const DailyReducer = createReducer<type.DAILYREDUCERTYPE, type.dailyActionType>(
    initialState,
    {
        [OPEN_DAILYTOGGLE]: (state, action) =>
            produce(state, (draft) => {
                draft.ToggleValue = action.payload;
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