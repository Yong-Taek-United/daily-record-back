import * as type from '../types';

export const SET_EVENTSDATA = 'setEventsData/SET_EVENTSDATA' as const;
export const setEventsData = (event: type.eventData[]) => ({
    type: SET_EVENTSDATA,
    payload: event,
});
