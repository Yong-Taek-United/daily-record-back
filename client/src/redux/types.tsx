import { setUserData } from './actions/userAction';
import { OpenDailyToggle, setDailyData} from './actions/dailyAction';
import { setEventsData } from './actions/eventAction';

// User
export type userData = {
    id: number;
    email: string;
    username: string;
} | null;

export type USERDATA = {
    CurrUserData: userData;
}

export type setUserDataAction = ReturnType<typeof setUserData>

// Daily
export type isOpened = boolean;

export type dailyData = {
    id: number;
    date: string;
    events: {
        id: number;
        description: string;
    }[] | null
} | null;

export type DAILYREDUCERTYPE = {
    openCloseValue: boolean;
    CurDailyData: dailyData;
    DailiesData: dailyData[];
}

export type changeDailyToggleAction = {
    openCloseValue: ReturnType<typeof OpenDailyToggle>;
    CurDailyData: ReturnType<typeof setDailyData>;
}

// Event
export type eventData = {
    id: number;
    description: string;
}

export type EVENTEDUCERTYPE = {
    EventsData: eventData[];
}

export type setEventDataAction = ReturnType<typeof setEventsData>