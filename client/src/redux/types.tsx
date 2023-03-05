import { setUserData } from './actions/userAction';
import { OpenDailyToggle, setDailyDate, setDailyData} from './actions/dailyAction';
import { setEventsData } from './actions/eventAction';
import { Dayjs } from 'dayjs';

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

export type dailyDate = Dayjs | null;

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
    CurDailyDate: Dayjs | null;
    CurDailyData: dailyData;
    DailiesData: dailyData[];
}

export type dailyActionType = {
    openCloseValue: ReturnType<typeof OpenDailyToggle>;
    CurDailyDate: ReturnType<typeof setDailyDate>;
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