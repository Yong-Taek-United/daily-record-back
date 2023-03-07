import * as type from '../types';

export const SET_EVENTSDATA = 'setEventsData/SET_EVENTSDATA' as const;
export const setEventsData = (event: type.eventData[]) => ({
    type: SET_EVENTSDATA,
    payload: event,
});

export const SET_EVENTID = 'setEventId/SET_EVENTID' as const;
export const setEventId = (eventId: type.eventId) => ({
    type: SET_EVENTID,
    payload: eventId,
});
