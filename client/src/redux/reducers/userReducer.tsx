import { createReducer } from 'typesafe-actions';
import produce from 'immer';
import * as type from '../types';
import { SET_USERDATA } from '../actions/userAction';

export const initialState: type.USERREDUCERTYPE= {
    CurUserData: null
}

const UserReducer = createReducer<type.USERREDUCERTYPE, type.userActionType>(
    initialState,
    {
        [SET_USERDATA]: (state, action) =>
            produce(state, (draft) => {
                draft.CurUserData = action.payload;
        }),
    }
)

export default UserReducer;