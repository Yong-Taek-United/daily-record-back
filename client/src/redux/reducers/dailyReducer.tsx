import * as type from '../types';
import { OPEN_DAILYTOGGLE, SET_DAILYDATA, SET_DAILIESDATA } from '../actions/dailyAction';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';

export const initialState: type.DAILYREDUCERTYPE= {
    openCloseValue: false,
    CurDailyData: null,
    DailiesData: []
}

const openDailyToggle = createReducer<type.DAILYREDUCERTYPE, any>(
    initialState,
    {
        [OPEN_DAILYTOGGLE]: (state, action) =>
            produce(state, (draft) => {
                draft.openCloseValue = action.payload;
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

export default openDailyToggle;