import * as type from '../types';
import { CHANGE_DAILYTOGGLE } from '../actions/dailyAction';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';

export const initialState: type.OPENORCLOSEVALUE= {
    openCloseValue: false
}

const openDailyToggle = createReducer<type.OPENORCLOSEVALUE, type.changeDailyToggleAction>(
    initialState,
    {
        [CHANGE_DAILYTOGGLE]: (state, action) =>
            produce(state, (draft) => {
                draft.openCloseValue = action.payload;
            })
    }
)

export default openDailyToggle;