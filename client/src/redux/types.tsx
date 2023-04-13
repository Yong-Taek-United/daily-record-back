import { setUserData } from './actions/userAction';
import { OpenDailyToggle, setDailyDate, setDailyData, setDailiesData, setDailyId, setTargetElement, setYearMonth} from './actions/dailyAction';
import { setEventId, setEventsData } from './actions/eventAction';
import { Dayjs } from 'dayjs';

// User
export type userData = {
    id: number;
    email: string;
    username: string;
} | null;

export type USERREDUCERTYPE = {
    CurUserData: userData;
}

export type userActionType = ReturnType<typeof setUserData>;

// Daily
export type isOpened = boolean;

export type targetElement = any;

export type yearMonth = number[];

export type dailyDate = Dayjs | null;

export type dailyId = number | null;

export type dailyData = {
    id: number;
    year: number;
    month: number;
    day: number;
    events: {
        id: number;
        title: string;
    }[] | null
} | null;

export type DAILYREDUCERTYPE = {
    ToggleValue: isOpened;
    TargetElement: targetElement;
    CurYearMonth: yearMonth;
    CurDailyDate: dailyDate;
    TargetDailyId: dailyId;
    CurDailyData: dailyData;
    DailiesData: dailyData[];
}

export type dailyActionType = 
    | ReturnType<typeof OpenDailyToggle>
    | ReturnType<typeof setTargetElement>
    | ReturnType<typeof setYearMonth>
    | ReturnType<typeof setDailyDate>
    | ReturnType<typeof setDailyId>
    | ReturnType<typeof setDailyData>
    | ReturnType<typeof setDailiesData>;


// Event
export type eventId = number | null;

export type eventData = {
    id: number;
    title: string;
    isChecked: boolean;
}

export type EVENTEDUCERTYPE = {
    EventsData: eventData[];
    TargetEventId: eventId;
}

export type eventActionType = 
    | ReturnType<typeof setEventsData>
    | ReturnType<typeof setEventId>