import * as type from '../types';
import { SET_USERDATA } from '../actions/userAction';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';

export const initialState: type.USERDATA= {
    CurrUserData: null
}

const setUserData = createReducer<type.USERDATA, any>(
    initialState,
    {
        [SET_USERDATA]: (state, action) =>
            produce(state, (draft) => {
                draft.CurrUserData = action.payload;
        }),
    }
)

export default setUserData;