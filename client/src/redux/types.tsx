import { setUserData } from './actions/userAction';
import { OpenDailyToggle } from './actions/dailyAction';

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

export type OPENORCLOSEVALUE = {
    openCloseValue: boolean;
    CurDailyData: dailyData;
}

export type changeDailyToggleAction = {
    openCloseValue: ReturnType<typeof OpenDailyToggle>;
}