import * as type from '../types';
import { OPEN_DAILYTOGGLE, SET_DAILYDATA } from '../actions/dailyAction';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';

export const initialState: type.OPENORCLOSEVALUE= {
    openCloseValue: false,
    CurDailyData: null
}

const openDailyToggle = createReducer<type.OPENORCLOSEVALUE, any>(
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
    }
)

// const setDailyData = createReducer<type.OPENORCLOSEVALUE, type.changeDailyToggleAction>(
//     initialState,
//     {
//         [CHANGE_DAILYTOGGLE]: (state, action) =>
//             produce(state, (draft) => {
//                 draft.openCloseValue = action.payload;
//         })
//     }
// )

export default openDailyToggle;