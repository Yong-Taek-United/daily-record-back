import * as type from '../types';
import { SET_EVENTSDATA } from '../actions/eventAction';
import produce from 'immer';
import { createReducer } from 'typesafe-actions';

export const initialState: type.EVENTEDUCERTYPE= {
    EventsData: []
}

const setEventData = createReducer<type.EVENTEDUCERTYPE, any>(
    initialState,
    {
        [SET_EVENTSDATA]: (state, action) =>
            produce(state, (draft) => {
                draft.EventsData = action.payload;
        }),
    }
)

export default setEventData;