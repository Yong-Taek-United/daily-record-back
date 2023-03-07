import { createReducer } from 'typesafe-actions';
import produce from 'immer';
import * as type from '../types';
import { SET_EVENTID, SET_EVENTSDATA } from '../actions/eventAction';

export const initialState: type.EVENTEDUCERTYPE= {
    EventsData: [],
    TargetEventId: null,
}

const EventReducer = createReducer<type.EVENTEDUCERTYPE, type.eventActionType>(
    initialState,
    {
        [SET_EVENTSDATA]: (state, action) =>
            produce(state, (draft) => {
                draft.EventsData = action.payload;
        }),
        [SET_EVENTID]: (state, action) =>
            produce(state, (draft) => {
                draft.TargetEventId = action.payload;
        }),
    }
)

export default EventReducer;