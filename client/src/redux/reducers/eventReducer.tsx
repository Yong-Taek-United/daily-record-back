import { createReducer } from 'typesafe-actions';
import produce from 'immer';
import * as type from '../types';
import { SET_EVENTSDATA } from '../actions/eventAction';

export const initialState: type.EVENTEDUCERTYPE= {
    EventsData: []
}

const EventReducer = createReducer<type.EVENTEDUCERTYPE, type.eventActionType>(
    initialState,
    {
        [SET_EVENTSDATA]: (state, action) =>
            produce(state, (draft) => {
                draft.EventsData = action.payload;
        }),
    }
)

export default EventReducer;