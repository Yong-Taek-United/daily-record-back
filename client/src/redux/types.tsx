import { setUserData } from './actions/userAction';
import { OpenDailyToggle, setDailyDate, setDailyData, setDailiesData} from './actions/dailyAction';
import { setEventsData } from './actions/eventAction';
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

export type dailyDate = Dayjs | null;

export type dailyData = {
    id: number;
    year: number;
    month: number;
    day: number;
    events: {
        id: number;
        description: string;
    }[] | null
} | null;

export type DAILYREDUCERTYPE = {
    ToggleValue: boolean;
    CurDailyDate: Dayjs | null;
    CurDailyData: dailyData;
    DailiesData: dailyData[];
}

export type dailyActionType = 
    | ReturnType<typeof OpenDailyToggle>
    | ReturnType<typeof setDailyDate>
    | ReturnType<typeof setDailyData>
    | ReturnType<typeof setDailiesData>;


// Event
export type eventData = {
    id: number;
    description: string;
}

export type EVENTEDUCERTYPE = {
    EventsData: eventData[];
}

export type eventActionType = ReturnType<typeof setEventsData>